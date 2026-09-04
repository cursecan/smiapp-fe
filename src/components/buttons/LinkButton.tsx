import { Link } from "@tanstack/react-router"
import { Link as HeroLink } from "@heroui/react"

const LinkButton = ({label, to, icon, params=null, className=null, hideIcon=false, props}) => {
  return (
    <Link className={`link button ${className}`} to={to} params={params} {...props} >
        <p>{label || 'Button'}</p>
        {
            !hideIcon && (
                <HeroLink.Icon>
                    { icon }
                </HeroLink.Icon>
            )
        }
    </Link>
  )
}

export default LinkButton