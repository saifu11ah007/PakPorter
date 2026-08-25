// rateLimiter.js — In-memory per-user rate limiter
// Limit: maxRequests per windowMs per authenticated user

const rateLimitStore = new Map();

const createRateLimiter = ({ maxRequests = 10, windowMs = 60000 } = {}) => {
  // Cleanup stale entries every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore) {
      if (now > entry.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);

  return (req, res, next) => {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const key = `ratelimit:${userId}`;
    const now = Date.now();
    let entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
      // Start a new window
      entry = { count: 1, resetTime: now + windowMs };
      rateLimitStore.set(key, entry);
      return next();
    }

    if (entry.count >= maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      return res.status(429).json({
        success: false,
        message: `Too many requests. Please try again in ${retryAfter} seconds.`
      });
    }

    entry.count++;
    return next();
  };
};

export default createRateLimiter;
