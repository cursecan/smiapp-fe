import {  Envelope, HandPointRight, Persons, Timestamps, House, MapPin, LogoYandexCloud, LogoUbuntu, FaceRobotSmile, TagDollar, RoundBrackets } from "@gravity-ui/icons"
import NavButton from "./buttons/NavButton"
import { useAuth } from "../auth/AuthProvider"



const AssideBar = () => {
    const { logout } = useAuth()
    return (
        <div className="fixed top-0 left-0 w-72 h-screen flex flex-col">
            {/* <div className="h-24"></div> */}
            <div className="flex-1 flex flex-col p-0">
                <div className="flex flex-col flex-1 p-4 bg-linear-0 from-white/50 to-white/80">
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
                        {/* Komersial */}
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
                        {/* Oprasinal */}
                        <div className="">
                            <div className="text-xs uppercase mb-3">Oprasional</div>
                            <ul className="">
                                <li>
                                    <NavButton active icon={<RoundBrackets />} label={'Ops'} href={'/oprasional/oprasional'}/>
                                </li>
                                <li>
                                    <NavButton active icon={<TagDollar />} label={'Pembayaran'} href={'/oprasional/pembayaran'} />
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