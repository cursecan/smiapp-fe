import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import AssideBar from '../../components/AssideBar';
import { Avatar, Button } from '@heroui/react';
import { Bell } from '@gravity-ui/icons';
import TopNavbar from '../../components/TopNavbar';

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
        <TopNavbar />
        <AssideBar />
        <div className="ml-72 mt-24">
            <Outlet />
        </div>
    </div>
  )
}
