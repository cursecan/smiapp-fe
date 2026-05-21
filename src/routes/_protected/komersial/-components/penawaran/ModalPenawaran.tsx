import ModalComponent from '../../../../../components/modals/ModalComponent'
import CreatePenawaranForm from './CreatePenawaranForm'
import { Button, useOverlayState } from '@heroui/react'
import { LogoTelegram } from '@gravity-ui/icons'

const ModalPenawaran = ({pesanan, disabled=false, simple=false}) => {
    const state = useOverlayState()


  return (
    <ModalComponent
        state={state}
        heading={'Mulai Membuat Penawaran'}
        buttonTrigger={ simple ? <Button isIconOnly variant='secondary' size='sm' isDisabled={disabled} onPress={state.setOpen}><LogoTelegram /> </Button> : <Button variant='primary' size='sm' isDisabled={disabled} onPress={state.setOpen}><LogoTelegram /> Buat Penawaran</Button>}
        hideFooter
    >
        <CreatePenawaranForm pesanan={pesanan} state={state} />
    </ModalComponent>
  )
}

export default ModalPenawaran