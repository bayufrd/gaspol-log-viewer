import { Grid, Card, Text } from '@geist-ui/react'
import ThemeToggle from './ThemeToggle'
import SidebarNavigation from './SidebarNavigation'

export default function ApiDocLayout({ children, swaggerData }) {
  return (
    <div className="flex">
      <SidebarNavigation swaggerData={swaggerData} />
      
      <div className="flex-grow p-4">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        
        <Grid.Container gap={2}>
          <Grid xs={24}>
            <Card width="100%">
              {children}
            </Card>
          </Grid>
        </Grid.Container>
      </div>
    </div>
  )
}
