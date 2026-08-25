// ScraperController.js — Two-layer product URL scraper
import axios from 'axios';
import { load } from 'cheerio';

// ─── Security: URL validation ───────────────────────────────────────────────

const BLOCKED_HOSTNAMES = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '169.254.169.254',
];

const BLOCKED_IP_RANGES = [
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,       // 10.x.x.x
  /^192\.168\.\d{1,3}\.\d{1,3}$/,           // 192.168.x.x
  /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/, // 172.16-31.x.x
];

const isBlockedHost = (hostname) => {
  if (BLOCKED_HOSTNAMES.includes(hostname)) return true;
  return BLOCKED_IP_RANGES.some((regex) => regex.test(hostname));
};

const isAmazonDomain = (hostname) => {
  return /^(www\.)?(amazon\.(com|co\.uk|ca|de|fr|it|es|in|co\.jp|com\.au|com\.br|com\.mx|sg|ae|sa|nl|pl|se|com\.be|com\.tr|eg)|a\.co|amzn\.to)$/i.test(hostname);
};

// ─── Sanitization ───────────────────────────────────────────────────────────

const stripHtml = (text) => {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '')   // Remove HTML tags
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')      // Collapse whitespace
    .trim();
};

// ─── Price extraction helpers ───────────────────────────────────────────────

const CURRENCY_MAP = {
  '$': 'USD',
  '£': 'GBP',
  '€': 'EUR',
  '¥': 'JPY',
  '₹': 'INR',
};

const PRICE_REGEX = /(?:(?:Rs\.?|PKR|AED|USD|\$|£|€|¥|₹|SAR)\s*[\d,]+(?:\.\d{1,2})?|[\d,]+(?:\.\d{1,2})?\s*(?:Rs\.?|PKR|AED|USD|SAR))/i;

const extractPriceAndCurrency = (priceText) => {
  if (!priceText) return { price: null, currency: null };

  const cleaned = priceText.replace(/,/g, '').trim();

  // Detect currency
  let currency = null;
  for (const [symbol, code] of Object.entries(CURRENCY_MAP)) {
    if (cleaned.includes(symbol)) {
      currency = code;
      break;
    }
  }
  if (!currency) {
    if (/Rs\.?|PKR/i.test(cleaned)) currency = 'PKR';
    else if (/AED/i.test(cleaned)) currency = 'AED';
    else if (/SAR/i.test(cleaned)) currency = 'SAR';
    else if (/USD/i.test(cleaned)) currency = 'USD';
  }

  // Extract numeric value
  const numMatch = cleaned.match(/[\d,]+(?:\.\d{1,2})?/);
  const price = numMatch ? numMatch[0].replace(/,/g, '') : null;

  return { price, currency };
};

// ─── Layer 1: Open Graph / Meta tags ────────────────────────────────────────

const extractFromOGTags = ($) => {
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDescription = $('meta[property="og:description"]').attr('content');
  const ogImage = $('meta[property="og:image"]').attr('content');
  const ogPrice = $('meta[property="og:price:amount"]').attr('content') ||
                  $('meta[property="product:price:amount"]').attr('content');
  const ogCurrency = $('meta[property="og:price:currency"]').attr('content') ||
                     $('meta[property="product:price:currency"]').attr('content');
  const ogSiteName = $('meta[property="og:site_name"]').attr('content');

  const title = stripHtml(ogTitle);
  const image = ogImage ? ogImage.trim() : null;

  // OG layer is successful only if both title and image are present
  if (title && image) {
    return {
      productName: title,
      description: stripHtml(ogDescription) || '',
      imageUrl: image,
      price: ogPrice || null,
      currency: ogCurrency || null,
      siteName: stripHtml(ogSiteName) || null,
      source: 'og',
    };
  }

  return null;
};

// ─── Layer 2: HTML parsing fallback ─────────────────────────────────────────

const extractFromHTML = ($) => {
  // Product name: first <h1>
  const h1Text = stripHtml($('h1').first().text());

  // Product image: first <img> with reasonable dimensions
  let imageUrl = null;
  $('img').each((_, el) => {
    if (imageUrl) return;
    const src = $(el).attr('src') || $(el).attr('data-src');
    const width = parseInt($(el).attr('width'), 10);
    const srcset = $(el).attr('srcset');

    if (src && (width > 200 || srcset || !$(el).attr('width'))) {
      // Skip tiny icons, tracking pixels, and data URIs that are tiny
      if (src.startsWith('data:') && src.length < 200) return;
      if (/icon|logo|badge|sprite|pixel|tracking/i.test(src)) return;
      imageUrl = src;
    }
  });

  // Description: meta description
  const metaDesc = $('meta[name="description"]').attr('content');

  // Price: scan visible text for price patterns
  let priceText = null;
  const priceSelectors = [
    '[class*="price"]', '[id*="price"]',
    '[class*="Price"]', '[id*="Price"]',
    '[data-price]',
    '.a-price .a-offscreen',  // Amazon-specific
    '#priceblock_ourprice',    // Amazon
    '#priceblock_dealprice',   // Amazon
    '.price-current',          // Newegg
  ];

  for (const selector of priceSelectors) {
    const el = $(selector).first();
    if (el.length) {
      const text = stripHtml(el.text());
      if (PRICE_REGEX.test(text)) {
        priceText = text.match(PRICE_REGEX)?.[0] || null;
        break;
      }
    }
  }

  // If no price from selectors, do a broader body scan (limited)
  if (!priceText) {
    const bodyText = stripHtml($('body').text());
    const priceMatch = bodyText.match(PRICE_REGEX);
    if (priceMatch) priceText = priceMatch[0];
  }

  const { price, currency } = extractPriceAndCurrency(priceText);

  if (h1Text || imageUrl) {
    return {
      productName: h1Text || '',
      description: stripHtml(metaDesc) || '',
      imageUrl: imageUrl || null,
      price,
      currency,
      siteName: null,
      source: 'html',
    };
  }

  return null;
};

// ─── Main controller ────────────────────────────────────────────────────────

const fetchProductDetails = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ success: false, message: 'URL is required.' });
    }

    // Security: must be HTTPS
    if (!url.startsWith('https://')) {
      return res.status(400).json({
        success: false,
        message: 'Only HTTPS URLs are allowed.'
      });
    }

    // Security: parse and validate hostname
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid URL format.' });
    }

    if (isBlockedHost(parsedUrl.hostname)) {
      return res.status(400).json({
        success: false,
        message: 'This URL is not allowed.'
      });
    }

    // Build browser-like request headers for ALL sites
    // Most e-commerce sites (Amazon, eBay, Walmart etc.) block non-browser User-Agents
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Ch-Ua': '"Chromium";v="126", "Google Chrome";v="126", "Not-A.Brand";v="8"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
    };

    // Amazon-specific: add referer and mock session cookies to bypass WAF checks
    if (isAmazonDomain(parsedUrl.hostname)) {
      headers['Referer'] = `https://${parsedUrl.hostname}/`;
      // Generate a mock session-id that matches Amazon format (3 groups of numbers: 3-7-7 digits)
      const mockSessionId = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}`;
      headers['Cookie'] = `session-id=${mockSessionId}; i18n-prefs=USD;`;
    }

    // Fetch the page HTML — try once, retry with alternate UA on 403
    let html;
    const axiosConfig = {
      headers,
      timeout: 8000,
      maxRedirects: 5,
      responseType: 'text',
      maxContentLength: 2 * 1024 * 1024,
      // Prevent axios from throwing on non-2xx so we can handle 403 ourselves
      validateStatus: (status) => status < 500,
    };

    try {
      let response = await axios.get(url, axiosConfig);

      // If 403, retry with a different User-Agent (mobile)
      if (response.status === 403) {
        console.log('Scraper: Got 403, retrying with mobile UA...');
        axiosConfig.headers = {
          ...headers,
          'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
          'Sec-Ch-Ua-Mobile': '?1',
          'Sec-Ch-Ua-Platform': '"Android"',
        };
        response = await axios.get(url, axiosConfig);
      }

      if (response.status !== 200) {
        console.error(`Scraper: HTTP ${response.status} from ${parsedUrl.hostname}`);
        return res.status(200).json({
          success: false,
          message: 'Could not fetch product details from this link. Please fill in the details manually.'
        });
      }

      html = response.data;
    } catch (fetchErr) {
      console.error('Scraper fetch error:', fetchErr.message);
      return res.status(200).json({
        success: false,
        message: 'Could not fetch product details from this link. Please fill in the details manually.'
      });
    }

    // Parse HTML
    const $ = load(html);

    // Derive site name from domain if not available from OG tags
    const domainName = parsedUrl.hostname.replace(/^www\./, '');
    const fallbackSiteName = domainName.charAt(0).toUpperCase() + domainName.slice(1);

    // Layer 1: OG tags
    let result = extractFromOGTags($);

    // Layer 2: HTML fallback (only if Layer 1 failed)
    if (!result) {
      result = extractFromHTML($);
    }

    if (!result || (!result.productName && !result.imageUrl)) {
      return res.status(200).json({
        success: false,
        message: 'Could not fetch product details from this link. Please fill in the details manually.'
      });
    }

    // Fill in missing siteName
    if (!result.siteName) {
      result.siteName = fallbackSiteName;
    }

    // Clean up: remove source field (internal only)
    delete result.source;

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('ScraperController error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not fetch product details from this link. Please fill in the details manually.'
    });
  }
};

export { fetchProductDetails };
