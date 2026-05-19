import { ArrowRightFromSquare, BellDot, Cup, Envelope, Gear, Headphones, House, Person, Route, Shapes4 } from '@gravity-ui/icons'
import { Avatar, Button, Dropdown, Label, Surface } from '@heroui/react'
import { useAuth } from '../auth/AuthProvider'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { fallbackName } from '../utils/useFallbackName'

const TopNavbar = () => {
    const {user, logout} = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

  return (
    <div className="bg-white flex items-center justify-end gap-6 h-16 px-10">
        <div className="flex flex-1 gap-2 items-center">
            {/* <Surface className='bg-amber-400 text-black p-1 rounded-full'>
                <FaceRobot className='size-8' />
            </Surface> */}
            <img src="/logo3.png" alt="logo" className='h-10' />
            <div className="text-2xl font-black">NaviAgent</div>
        </div>
        <Surface variant='secondary' className="flex items-center rounded-full">
            <Button variant='ghost'>
                <House />
                Dashboard
            </Button>
            {/* Komersial */}
            <Dropdown>
                <Dropdown.Trigger>
                <Button variant="tertiary" className={location.pathname.includes('/komersial') && 'bg-black text-white'} >
                    <Headphones />
                    Komersial
                </Button>
                </Dropdown.Trigger>
                <Dropdown.Popover>
                <Dropdown.Menu>
                    <Dropdown.Item onPress={() => navigate({to: '/komersial/email'})}>
                        <Envelope />
                        <Label>Email</Label>
                    </Dropdown.Item>
                    <Dropdown.Item onPress={() => navigate({to: '/komersial/penawaran'})}>
                        <Cup />
                        <Label>Penawaran</Label>
                    </Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown.Popover>
            </Dropdown>
            {/* Operasioanl */}
            <Button onPress={() => navigate({to: '/oprasional/oprasional'})} variant='ghost' className={location.pathname.includes('/oprasional') && 'bg-black text-white'}>
                <Route />
                Operasional
            </Button>
            {/* Master */}
            <Dropdown>
                <Dropdown.Trigger>
                <Button variant="tertiary" className={location.pathname.includes('/master') && 'bg-black text-white'} >
                    <Shapes4 />
                    Master Data
                </Button>
                </Dropdown.Trigger>
                <Dropdown.Popover>
                <Dropdown.Menu>
                    <Dropdown.Item>
                        <Envelope />
                        <Label>Email</Label>
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <Cup />
                        <Label>Penawaran</Label>
                    </Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown.Popover>
            </Dropdown>
            <Dropdown>
                <Dropdown.Trigger>
                <Button variant="tertiary" className={location.pathname.includes('/settings') && 'bg-black text-white'} >
                    <Gear />
                    Settings
                </Button>
                </Dropdown.Trigger>
                <Dropdown.Popover>
                <Dropdown.Menu>
                    <Dropdown.Item>
                        <Envelope />
                        <Label>Email</Label>
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <Cup />
                        <Label>Penawaran</Label>
                    </Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown.Popover>
            </Dropdown>
        </Surface>
        <Button isIconOnly variant='tertiary'>
            <BellDot />
        </Button>
        <Dropdown>
            <Dropdown.Trigger>
                <Button variant='tertiary'>
                    <Person /> {fallbackName(user.full_name)}
                </Button>
            </Dropdown.Trigger>
            <Dropdown.Popover>
                <div className="flex items-center gap-2 p-3">
                    <Avatar size='sm'>
                        <Avatar.Image src='https://img.heroui.chat/image/avatar?w=400&h=400&u=4' />
                    </Avatar>
                    <Label>{user.full_name}</Label>
                </div>

                <Dropdown.Menu>
                    <Dropdown.Item variant='danger' onPress={logout}>
                        <div className="flex w-full items-center justify-between gap-2">
                            <Label>Log Out</Label>
                            <ArrowRightFromSquare className="size-3.5 text-danger" />
                        </div>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
        
    </div>
  )
}

export default TopNavbar