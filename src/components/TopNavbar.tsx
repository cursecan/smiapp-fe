import { Bell, SquareDashed } from '@gravity-ui/icons'
import { Avatar, Button } from '@heroui/react'
import { useAuth } from '../auth/AuthProvider'

const TopNavbar = () => {
    const {user} = useAuth()

  return (
    <div className='fixed z-10 top-0 inset-x-0 h-24 p-4 backdrop-blur-sm'>
        <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4">
            <div className="flex-1"></div>
            <div className="flex items-center p-1 bg-neutral-100 rounded-full overflow-hidden">
                <Button isIconOnly variant='ghost'>
                    <SquareDashed />
                </Button>
                <Button isIconOnly variant='secondary' className={'bg-white'}>
                    <Bell/>
                </Button>
            </div>
            <div className="flex items-center bg-neutral-100 overflow-hidden rounded-full">
                <Avatar>
                    <Avatar.Fallback className='bg-orange-500 text-white'>AS</Avatar.Fallback>
                </Avatar>
                <div className="flex px-4 items-center">
                    <div className="">
                        <div className="">{user?.full_name}</div>
                        {/* <div className="text-sm">Admin</div> */}

                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TopNavbar