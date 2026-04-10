import React from 'react'
import ModalComponent from '../../../../../components/modals/ModalComponent'
import CreatePenawaranForm from './CreatePenawaranForm'
import { Button, useOverlayState } from '@heroui/react'
import { Plus } from '@gravity-ui/icons'

const ModalPenawaran = ({pesanan, disabled=false}) => {
    const state = useOverlayState()


  return (
    <ModalComponent
        state={state}
        heading={'Form Create Penawaran'}
        buttonTrigger={<Button isDisabled={disabled} onPress={state.setOpen}><Plus /> Buat Penawaran</Button>}
        hideFooter
    >
        <CreatePenawaranForm pesanan={pesanan} state={state} />
    </ModalComponent>
  )
}

export default ModalPenawaran