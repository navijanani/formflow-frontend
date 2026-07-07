/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm & Earthy Theme - Light Mode
        primary: '#c2410c',          // burnt orange (same in both modes)
        'primary-dark': '#9a3412',
        
        // Light mode colors
        cream: '#fdfcf8',            // light background
        beige: '#f7f5f0',            // light card background
        'beige-dark': '#efede8',     // light input background
        'brown-dark': '#431407',     // light text dark
        'brown': '#92400e',          // light text muted
        'warm-gray': '#e7e5e4',      // light borders
        
        // Dark mode colors
        'dark-bg': '#1b1613',        // dark background
        'dark-surface': '#2a2421',   // dark card/panel background
        'dark-elevated': '#3a332e',  // dark input background
        'dark-border': '#4a3f38',    // dark borders (lighter)
        'dark-border-alt': '#3a332e',// dark borders (medium)
        'dark-border-subtle': '#2a2421', // dark borders (subtle)
        'dark-text': '#f7f4ef',      // dark mode text
      },
      fontFamily: {
        'display': ['Fraunces', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 20px 60px rgba(194, 65, 12, 0.16)',
        warm: '0 10px 40px rgba(67, 20, 7, 0.08)',
        'dark-glow': '0 6px 7px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
