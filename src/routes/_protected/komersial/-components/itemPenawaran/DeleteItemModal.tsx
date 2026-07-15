import { Button, CloseButton, Description, Label, useOverlayState } from '@heroui/react'
import ModalComponent from '../../../../../components/modals/ModalComponent'
import { TrashBin } from '@gravity-ui/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useItemPenawaranService } from '../../../../../services/penawaran.service'

const DeleteItemModal = ({item}) => {

    const state = useOverlayState()
    const qc = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (id) => {
            return await useItemPenawaranService.delete(id)
        },
        onSuccess: () => {
            qc.invalidateQueries({queryKey:['item-penawaran']})
            state.close()
        }
    })

    const handleDelete = () => {
        mutation.mutate(item.id)
    }

  return (
    <ModalComponent
        state={state}
        buttonTrigger={<CloseButton className={'bg-danger-soft text-danger'} onPress={state.setOpen} isIconOnly size='sm'><TrashBin /></CloseButton>}
        hideFooter
        heading={'Delete Item'}
        hideHeader
        iconComponent={<TrashBin className='size-5 text-red-400' />}
    >
        <div className="mt-4 space-y-6">
            <div className="flex flex-col">
                <Label className="">{item.barang_jasa}</Label>
                {
                    item.keterangan && <Description>{item.keterangan}</Description>
                }
            </div>
            <div className="flex justify-end gap-3">
                <Button slot={'close'} variant='tertiary'>Batal</Button>
                <Button onPress={handleDelete} variant='danger'>Hapus</Button>
            </div>
        </div>
    </ModalComponent>
  )
}

export default DeleteItemModal