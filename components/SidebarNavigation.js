import { useState } from 'react'
import { Sidebar } from '@geist-ui/react'

export default function SidebarNavigation({ swaggerData }) {
  const [activeApi, setActiveApi] = useState(null)

  const renderApiList = () => {
    if (!swaggerData || !swaggerData.paths) return null

    return Object.entries(swaggerData.paths).map(([path, methods]) => (
      Object.entries(methods).map(([method, details]) => (
        <Sidebar.Item
          key={`${path}-${method}`}
          line
          onClick={() => setActiveApi({ path, method, details })}
        >
          <span className={`api-method method-${method}`}>
            {method.toUpperCase()}
          </span>
          {path}
        </Sidebar.Item>
      ))
    ))
  }

  return (
    <Sidebar width={250}>
      {renderApiList()}
    </Sidebar>
  )
}
