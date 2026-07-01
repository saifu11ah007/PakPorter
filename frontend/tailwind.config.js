module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        cardBase: 'var(--card-base)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        brandPrimary: 'var(--brand-primary)',
        brandAccent: 'var(--brand-accent)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        // We'll define specific neumorphic shadows in CSS variables or classes
      }
    },
  },
  plugins: [],
}
