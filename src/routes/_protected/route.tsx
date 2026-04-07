import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
        
        throw redirect({
          to: "/login",
        });
      }
    },
})

function RouteComponent() {
  return (
    <div className="">
        <div className="">Dashboard navbar</div>
        <Outlet />
    </div>
  )
}
