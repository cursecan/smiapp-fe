import { LogoPython, HouseFill, Envelope, HandPointRight, Persons, Timestamps, House, ChevronDown, MapPin, LogoYandexCloud, LogoUbuntu, FaceRobotSmile } from "@gravity-ui/icons"
import NavButton from "./buttons/NavButton"
import { useLocation } from "@tanstack/react-router"
import { useAuth } from "../auth/AuthProvider"



const AssideBar = () => {
    const location = useLocation()
    const { logout } = useAuth()
    return (
        <div className="fixed top-0 left-0 w-72 h-screen flex flex-col">
            {/* <div className="h-24"></div> */}
            <div className="flex-1 flex flex-col p-3">
                <div className="flex flex-col flex-1 p-4 bg-white/0 backdrop-blur-md rounded-xl shadow-xl">
                    <div className="mb-6 flex items-center gap-4">
                        <FaceRobotSmile className="size-8 text-white" />
                        <div className="text-xl text-white">SMILe</div>
                    </div>
                    <div className="flex-1 space-y-4">
                        <div className="">
                            <ul className="">
                                <li>
                                    <NavButton active icon={<House strokeWidth={0.3} />} label={'Home'} href={'/dashboard'} />
                                </li>
                            </ul>
                        </div>
                        <div className="">
                            <div className="text-xs uppercase mb-3">Komersial</div>
                            <ul className="">
                                <li>
                                    <NavButton active icon={<Envelope />} label={'Email'} href={'/komersial/email'} />
                                </li>
                                <li>
                                    <NavButton active icon={<HandPointRight />} label={'Penawaran'} href={'/komersial/penawaran'}/>
                                </li>
                            </ul>
                        </div>
                        <div className="">
                            <div className="text-xs font-light uppercase mb-3">Master Data</div>
                            <ul className="">
                                <li>
                                    <NavButton icon={<Persons />} label={'Pegawai'} />
                                </li>
                                <li>
                                    <NavButton icon={<Timestamps />} label={'Jabatan'}/>
                                </li>
                                <li>
                                    <NavButton icon={<LogoYandexCloud />} label={'Kapal'} />
                                </li>
                                <li>
                                    <NavButton icon={<MapPin />} label={'Lokasi'}/>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="">
                        <NavButton onPress={logout} icon={<LogoUbuntu />} label={'Logout'} />
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default AssideBar