import {  Envelope, Persons, House, MapPin, Bell, Circles5Random, Rocket, Flask, LogoDocker, Megaphone, Mug, ArrowRightFromSquare } from "@gravity-ui/icons"
import { useAuth } from "../auth/AuthProvider"
import { Avatar, Button, Label, Surface } from "@heroui/react"
import { useNavigate } from "@tanstack/react-router"


const NavButton = ({icon, name, onPress=()=>{}}) => {
    return (
        <Button onPress={onPress} fullWidth className={'rounded-lg flex justify-start'} variant="ghost">
            {
                icon && icon
            }
            <div className="">{name}</div>
        </Button>
    )
}


const AssideBar = () => {
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
                                <NavButton onPress={() => navigate({to: '/dashboard'})} icon={<House />} name={'Home'} />
                                <NavButton onPress={() => navigate({to: '/komersial/email'})}  icon={<Envelope />} name={'Email'} />
                                <NavButton onPress={() => navigate({to: '/komersial/penawaran'})} icon={<Circles5Random />} name={'Penawaran'} />
                                <NavButton icon={<Rocket />} name={'Operasional'} />
                                <NavButton icon={<Flask />} name={'Casbon'} />
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
                            <div className="">
                                <div className="">Account</div>
                                <Label>{user.full_name}</Label>
                            </div>
                        </div>
                        <Button onPress={logout} variant="ghost" size="sm" isIconOnly>
                            <ArrowRightFromSquare className="text-red-700" />
                        </Button>
                    </div>
                </div>
            </Surface>
        </div>
    )
}

export default AssideBar