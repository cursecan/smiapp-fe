
import { Rocket } from '@gravity-ui/icons'
import ModalComponent from '../modals/ModalComponent'
import { Button, useOverlayState } from '@heroui/react'

const ApprovalButton = ({label, icon, children, onApprove=()=>{}}) => {

    const state = useOverlayState()

  return (
    <ModalComponent
        state={state}
        heading={'Approval'}
        iconComponent={<Rocket className='size-6' />}
        buttonTrigger={<Button className={'bg-orange-500'} onPress={state.setOpen}>{icon && icon} {label || 'Approval'}</Button>}
        hideFooter
        hideHeader
    >
        <div className="">
            <div className="">{children}</div>
            <div className="mt-6 flex justify-end gap-2">
                <Button slot={'close'} variant='tertiary'>Batal</Button>
                {/* <Button></Button> */}
                <Button onPress={onApprove}>Apporve</Button>
            </div>
        </div>

    </ModalComponent>
  )
}

export default ApprovalButton