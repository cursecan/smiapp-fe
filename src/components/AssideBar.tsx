import {  Envelope, Persons, House, MapPin, Bell, Circles5Random, Rocket, Flask, LogoDocker, Megaphone, Mug, ArrowRightFromSquare, CircleDollar } from "@gravity-ui/icons"
import { useAuth } from "../auth/AuthProvider"
import { Avatar, Button, Description, Label, Surface } from "@heroui/react"
import { useLocation, useNavigate } from "@tanstack/react-router"


const NavButton = ({icon, name, active=false, onPress=()=>{}}) => {
    return (
        <Button onPress={onPress} fullWidth className={'rounded-lg flex justify-start'} variant={active ? 'tertiary' : 'ghost'}>
            {
                icon && icon
            }
            <div className="flex-1 text-left">{name}</div>
            {
                active && <div className="flex">
                    <div className="p-1 rounded-full bg-red-500"></div>
                </div>
            }
        </Button>
    )
}


const AssideBar = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const { logout, user } = useAuth()
    return (
        <div className="fixed left-0 top-0 w-72 h-screen p-2 flex flex-col">
            <Surface className="flex-1 flex text-sm flex-col h-full bg-gray-50 shadow rounded-xl">
                <div className="">
                    <div className="p-4 flex items-center">
                        <div className="flex-1">Smile Organization</div>
                        <Bell />
                    </div>
                </div>
                <div className="flex-1 overflow-auto">
                    <ul className="px-4 space-y-6">
                        <li>
                            <div className="text-xs mb-2">Home</div>
                            <div className="space-y-1">
                                <NavButton active={location.pathname.includes('/dashboard')} onPress={() => navigate({to: '/dashboard'})} icon={<House />} name={'Home'} />
                                <NavButton active={location.pathname.includes('/komersial/email')} onPress={() => navigate({to: '/komersial/email'})}  icon={<Envelope />} name={'Email'} />
                                <NavButton active={location.pathname.includes('/komersial/penawaran')} onPress={() => navigate({to: '/komersial/penawaran'})} icon={<Circles5Random />} name={'Penawaran'} />
                                <NavButton active={location.pathname.includes('/oprasional/oprasional')} onPress={() => navigate({to: '/oprasional/oprasional'})} icon={<Circles5Random />} icon={<Rocket />} name={'Operasional'} />
                                <NavButton active={location.pathname.includes('/oprasional/casbon')}  onPress={() => navigate({to: '/oprasional/casbon'})} icon={<Flask />} name={'Casbon'} />
                            </div>
                        </li>
                        <li>
                            <div className="text-xs mb-2">Keuangan</div>
                            <div className="space-y-1">
                                <NavButton active={location.pathname.includes('/keuangan/expense')} onPress={() => navigate({to: '/keuangan/expense'})} icon={<CircleDollar />} name={'Expense'} />
                            </div>
                        </li>
                        <li>
                            <div className="text-xs mb-2">Master Data</div>
                            <div className="space-y-1">
                                <NavButton icon={<LogoDocker />} name={'Kapal'} />
                                <NavButton icon={<MapPin />} name={'Pelabuhan'} />
                                <NavButton icon={<Persons />} name={'Pegawai'} />
                                <NavButton icon={<Megaphone />} name={'Pekerjaan'} />
                                <NavButton icon={<Mug />} name={'Jenis Pekerjaan'} />
                            </div>
                        </li>
                        <li>
                            <div className="text-xs mb-2">Settings</div>
                            <div className="space-y-1">
                                <NavButton icon={<LogoDocker />} name={'Approval'} />
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="p-4">
                    <div className="flex items-center">
                        <div className="flex-1 flex items-center gap-2">
                            <Avatar size='sm'>
                                <Avatar.Image src='https://img.heroui.chat/image/avatar?w=400&h=400&u=4' />
                            </Avatar>
                            <div className="flex flex-col">
                                {/* <div className="">Account</div> */}
                                <Label>{user.full_name}</Label>
                                <Description>{user.pegawai?.jabatan || '-'}</Description>
                            </div>
                        </div>
                        <Button onPress={logout} variant="danger" size="sm" isIconOnly>
                            <ArrowRightFromSquare className="white" />
                        </Button>
                    </div>
                </div>
            </Surface>
        </div>
    )
}

export default AssideBar