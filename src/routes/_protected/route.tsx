import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import AssideBar from '../../components/AssideBar';
import { Avatar, Button, ButtonGroup, Description, Dropdown, Label, Surface } from '@heroui/react';
import { Bell, BellDot, ChevronLeft, ChevronRight, Headphones, House, MapPinPlus,  Route as IconRoute, Envelope, Cup } from '@gravity-ui/icons';
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
        {/* <div className=" fixed -z-10 top-0 inset-x-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#0099ff" fill-opacity="1" d="M0,160L48,138.7C96,117,192,75,288,74.7C384,75,480,117,576,154.7C672,192,768,224,864,208C960,192,1056,128,1152,122.7C1248,117,1344,171,1392,197.3L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
        </div> */}
        {/* <TopNavbar /> */}
        
        {/* <AssideBar /> */}
        {/* <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex flex-col pr-3 pb-3">
              <div className="p-3 pt-0 pl-0">
                <div className="pt-3">
                  <div className="flex items-center">
                    <div className="flex-1"></div>
                    <div className="flex flex-row-reverse items-center gap-3 text-white">
                      <div className="">
                          <div className="">Anderi Setiawan</div>
                          <div className="text-xs font-light">Staff Komersial</div>
                      </div>
                      <Avatar>
                        <Avatar.Fallback>AS</Avatar.Fallback>
                        <Avatar.Image src='https://img.heroui.chat/image/avatar?w=400&h=400&u=3'alt='avatar'/>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 px-10">
                <Outlet />
              </div>

            </div>
        </div> */}

        <div className="min-h-screen flex flex-col">
          <div>
            <TopNavbar />
          </div>
          <div className="flex-1 px-10">
            <Outlet />
          </div>

        </div>
    </div>
  )
}
