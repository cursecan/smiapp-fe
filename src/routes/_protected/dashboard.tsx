import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {

  return <div>Hello "/_protected/dashboard"! dsds</div>
}
