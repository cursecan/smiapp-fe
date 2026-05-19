import { Button, useOverlayState } from '@heroui/react'
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
        buttonTrigger={<Button onPress={state.setOpen} variant='danger-soft' isIconOnly size='sm'><TrashBin /></Button>}
        hideFooter
        heading={'Delete Item'}
        iconComponent={<TrashBin className='size-6 text-red-500' />}
    >
        <div className="mt-4 space-y-6">
            <div className="">
                {/* {item.barang_jasa} */}
                <p>Yakin akan menghapus item pekerjaan ini?</p>
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