import { useEffect } from 'react'

const swaggerUrl = process.env.NEXT_PUBLIC_SWAGGER_URL || 'https://gaspollmanagementcenter.com/api-docs'  

export default function ApiDocs() {
  useEffect(() => {
    // Redirect langsung jika iframe tidak berfungsi
    window.location.href = swaggerUrl
  }, [])

  return (
    <div>
      <iframe 
        src={swaggerUrl}
        width="100%" 
        height="100vh" 
        style={{
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        onError={() => {
          window.location.href = "http://localhost:3001/api-docs"
        }}
      />
    </div>
  )
}
