import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import AssideBar from '../../components/AssideBar';

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
    <div className="min-h-screen">
      <AssideBar />
      <div className="ml-72">
        <Outlet />
      </div>
        
        {/* <div className="min-h-screen flex flex-col">
          <div>
            <TopNavbar />
          </div>
          <div className="flex-1 px-10">
            <Outlet />
          </div>

        </div> */}
    </div>
  )
}
