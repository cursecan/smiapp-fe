import { Link, useLocation } from "@tanstack/react-router"



const NavButton = ({icon, label, active=false, ...props}) => {
    const location = useLocation()
    const href_path = props.href || '/dashboard'


  return (
    <Link to={href_path}>
        <div className={`flex items-center gap-4 text-gray-700 py-2 rounded-2xl overflow-hidden px-4 ${location.pathname.includes(href_path) && active && 'bg-orange-500 text-white'}`}>
            {icon}
            <div className="">{label}</div>
        </div>
    </Link>
  )
}

export default NavButton