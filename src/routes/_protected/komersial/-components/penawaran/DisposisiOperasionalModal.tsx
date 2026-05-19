import { Button, Label, Surface, useOverlayState } from "@heroui/react"
import ModalComponent from "../../../../../components/modals/ModalComponent"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "../../../../../lib/useToast"

const DisposisiOperasionalModal = ({fnQuery, queryKey, isDisabled}) => {
    const state = useOverlayState()
    const toast = useToast()

    const qc = useQueryClient()
    const mutation = useMutation({
        mutationFn: fnQuery,
        onSuccess: (res) => {
            toast.success({message: 'Berhasil', description: 'Penawaran berhasil disposisi ke bidang operasional.'})        
            state.close()
            qc.invalidateQueries([...queryKey])
        }
    })


    const handleSubmit = () => {
        mutation.mutate()
    }

  return (
    <ModalComponent
        state={state}
        buttonTrigger={<Button isDisabled={isDisabled} onPress={state.setOpen} className={'bg-red-600'}>Disposisi Bidang Ops</Button>}
        heading={'Disposisi Operasional'}
        hideFooter
    >
        <Surface>
            <div className="">
                <Label>Lanjutkan penawaran ke bidang Operasional?</Label>
                <div className="flex gap-2 mt-6 justify-end">
                    <Button onPress={state.close} variant="tertiary">
                        Batal
                    </Button>
                    <Button onPress={handleSubmit}>
                        Ya, Lanjutkan
                    </Button>
                </div>
            </div>
        </Surface>
    </ModalComponent>
  )
}

export default DisposisiOperasionalModal