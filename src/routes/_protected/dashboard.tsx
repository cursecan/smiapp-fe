import { createFileRoute, redirect } from '@tanstack/react-router'
import HeaderPage from '../../components/HeaderPage'
import { Card, Description } from '@heroui/react'
import PeriodeFilter from '../../components/PeriodeFilter'

export const Route = createFileRoute('/_protected/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="">
      <HeaderPage title='My Dashoard' />
      <div className="">
        <Card>
          <Card.Header>
            <div className="flex justify-end">
              <div className="">
                <div className="flex justify-end">
                  <PeriodeFilter />
                </div>
                <Description>Lorem ipsum dolor sit amet consectetur.</Description>
              </div>
            </div>        
          </Card.Header>
          <Card.Content>
            
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}
