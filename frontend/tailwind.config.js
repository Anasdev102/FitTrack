export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#F36100',
        secondary: '#151515',
        accent: '#F36100',
        dark: '#151515',
        darkSecondary: '#0A0A0A',
        ink: '#111111',
        muted: '#6B7280',
        canvas: '#F5F5F5',
        line: '#E5E7EB',
      },
      boxShadow: {
        soft: '0 12px 30px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};
