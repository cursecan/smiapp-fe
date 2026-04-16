import React from 'react'
import ModalComponent from '../../../../../components/modals/ModalComponent'
import CreatePenawaranForm from './CreatePenawaranForm'
import { Button, useOverlayState } from '@heroui/react'
import { Plus, PlusShape } from '@gravity-ui/icons'

const ModalPenawaran = ({pesanan, disabled=false}) => {
    const state = useOverlayState()


  return (
    <ModalComponent
        state={state}
        iconComponent={<PlusShape className='size-8 text-orange-500' />}
        heading={'Buat Penawaran'}
        buttonTrigger={<Button size='sm' isDisabled={disabled} onPress={state.setOpen}><Plus /> Buat Penawaran</Button>}
        hideFooter
    >
        <CreatePenawaranForm pesanan={pesanan} state={state} />
    </ModalComponent>
  )
}

export default ModalPenawaran