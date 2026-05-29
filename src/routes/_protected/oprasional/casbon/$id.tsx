import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/oprasional/casbon/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_protected/oprasional/casbon/$id"!</div>
}
