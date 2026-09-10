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
    }
  };
  
  export default nextConfig;
  