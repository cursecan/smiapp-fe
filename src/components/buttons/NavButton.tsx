import { Link, useLocation } from "@tanstack/react-router"



const NavButton = ({icon, label, onPress, active=false, ...props}) => {
    const location = useLocation()
    const href_path = props.href || '#'


  return (

    <Link to={href_path} onClick={onPress}>
        <div className={`flex items-center gap-4 text-gray-700 py-2 rounded-2xl overflow-hidden px-4 ${location.pathname.includes(href_path) && active && 'bg-orange-500 text-white'}`}>
            {icon}
            <div className="">{label}</div>
        </div>
    </Link>
  )
}

export default NavButton