import { Card, Description, Label, Surface } from '@heroui/react'

const HeaderPage = ({title, description, children, rightAction}) => {
  return (
    <Surface variant='transparent'>
      <div className="flex items-center">
        <div className="flex flex-col flex-1">
            <Label className='text-2xl font-bold'>{title||'Title Header'}</Label>
            <Description>{description||'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde, quam.'}</Description>
        </div>
        { rightAction && rightAction}
      </div>
        { children }
    </Surface>
  )
}

export default HeaderPage