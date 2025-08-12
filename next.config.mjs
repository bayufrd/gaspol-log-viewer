/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    theme: {
      extend: {
        fontFamily: {
          sans: ['var(--font-geist-sans)'],
          mono: ['var(--font-geist-mono)']
        }
      }
    }
  };
  
  export default nextConfig;
  