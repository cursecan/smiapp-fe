import { BellDot, ChevronRight, Cup, Envelope, FaceRobot, Gear, Headphones, House, Route, Shapes4, SquareDashed } from '@gravity-ui/icons'
import { Avatar, Button, ButtonGroup, Dropdown, Label, Surface } from '@heroui/react'
import { useAuth } from '../auth/AuthProvider'
import { useLocation, useNavigate } from '@tanstack/react-router'

const TopNavbar = () => {
    const {user} = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

  return (
    <div className="bg-white flex items-center justify-end gap-6 h-16 px-10">
        <div className="flex flex-1 gap-2 items-center">
            <Surface className='bg-amber-400 text-black p-1 rounded-full'>
                <FaceRobot className='size-8' />
            </Surface>
            <div className="text-2xl font-black">Smile:</div>
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
            <Button variant='ghost'>
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
        <ButtonGroup variant='tertiary'>
            <Button variant='tertiary' isIconOnly>
                <Avatar size='sm'>
                <Avatar.Image src='https://img.heroui.chat/image/avatar?w=400&h=400&u=4' />
                </Avatar>
            </Button>
            <Button variant='tertiary'>
                <Label>{user.full_name}</Label>
                <ChevronRight />
            </Button>
        </ButtonGroup>
        
    </div>
  )
}

export default TopNavbar