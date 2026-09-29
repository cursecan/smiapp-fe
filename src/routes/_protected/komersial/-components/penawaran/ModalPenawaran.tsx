import ModalComponent from '../../../../../components/modals/ModalComponent'
import CreatePenawaranForm from './CreatePenawaranForm'
import { Button, useOverlayState } from '@heroui/react'
import { CodePullRequest, LogoTelegram, PencilToSquare, Plus, PlusShape } from '@gravity-ui/icons'

const ModalPenawaran = ({pesanan, revise=false, disabled=false, simple=false}) => {
    const state = useOverlayState()


  return (
    <ModalComponent
        state={state}
        heading={revise ? 'Revisi Penawaran' : 'Mulai Membuat Penawaran'}
        buttonTrigger={ simple ? <Button isIconOnly size='sm' className={revise && 'bg-warning'} isDisabled={disabled} onPress={state.setOpen}>{ revise ? <PencilToSquare /> : <Plus /> }</Button> : <Button variant='primary' size='sm' isDisabled={disabled} onPress={state.setOpen}><LogoTelegram /> Buat Penawaran</Button>}
        hideFooter
    >
        <CreatePenawaranForm is_revisi={revise} pesanan={pesanan} state={state} />
    </ModalComponent>
  )
}

export default ModalPenawaran