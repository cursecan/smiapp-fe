import { Description, Label, Surface } from '@heroui/react'
import type { PropsWithChildren, ReactNode } from 'react'

type Props = {
  children?: ReactNode | null,
  title: string,
  description?: string | null,
  rightAction?: ReactNode | null
}

const HeaderPage = ({children, title, description='', rightAction=null}: PropsWithChildren<Props>) => {
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