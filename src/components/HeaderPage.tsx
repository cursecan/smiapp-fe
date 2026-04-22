import { Card } from '@heroui/react'

const HeaderPage = ({children, title, description, icon}) => {
  return (
    <Card variant='transparent' className='bg-white/50'>
        { icon && icon}
        <Card.Header>
            {
                title && (
                    <Card.Title>
                        { title }
                    </Card.Title>
                )
            }
            {
                description && (
                    <Card.Description>
                        { description }
                    </Card.Description>
                )
            }
        </Card.Header>
        <Card.Footer>
            { children }
        </Card.Footer>
    </Card>
  )
}

export default HeaderPage