import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/oprasional/casbon/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/oprasional/casbon/"!</div>
}