import { createFileRoute } from '@tanstack/react-router'
import HeaderPage from '../components/HeaderPage'

export const Route = createFileRoute('/home')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="">
      <HeaderPage title='Dashboard Monitoring'></HeaderPage>
    </div>
  )
}
