import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return <div>Hello "/" This is Index!
    
<Link to={'/about'}>About</Link>
  </div>
}
