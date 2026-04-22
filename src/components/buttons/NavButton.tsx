import { Link, useLocation } from "@tanstack/react-router"



const NavButton = ({icon, label, onPress, active=false, ...props}) => {
    const location = useLocation()
    const href_path = props.href || '#'


  return (

    <Link to={href_path} onClick={onPress} className="">
        <div className={`flex items-center gap-4 text-gray-800 py-2 rounded-2xl overflow-hidden px-4 ${location.pathname.includes(href_path) && active && 'bg-sky-600/10'}`}>
            {
              icon && (
                <div className="text-purple-600">
                  { icon }
                </div>
              )
            }
            <div className="">{label}</div>
        </div>
    </Link>
  )
}

export default NavButton