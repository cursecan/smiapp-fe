import { LayoutSideContent } from '@gravity-ui/icons'
import { Label, Surface } from '@heroui/react'
import type { PropsWithChildren, ReactNode } from 'react'

type Props = {
  title: string,
  breadchrumb?: ReactNode | null
}

const HeaderPage = ({title, breadchrumb}: PropsWithChildren<Props>) => {
  return (
    <Surface variant='transparent'>
      <div className="flex items-center gap-2 h-16">
        <LayoutSideContent className='size-6 ml-5' />
        <div className="flex flex-col flex-1">
            {
              breadchrumb ? breadchrumb : (
                <Label className='text-lg text-gray-500'>{title||'Title Header'}</Label>
              )
            }
        </div>
      </div>
    </Surface>
  )
}

export default HeaderPage