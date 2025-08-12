/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {  
      return [  
        {  
          source: '/swagger-docs',  
          destination: 'http://localhost:3001/swagger-docs'  
        }  
      ]  
    },
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
  