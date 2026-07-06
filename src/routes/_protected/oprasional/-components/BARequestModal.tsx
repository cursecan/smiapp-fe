import { Button, Label, TextArea, toast, useOverlayState } from "@heroui/react"
import ModalComponent from "../../../../components/modals/ModalComponent"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useOprasionalService } from "../../../../services/oprasional/oprasionalService"
import { useToast } from "../../../../lib/useToast"

const BARequestModal = ({oprs}) => {
    const state = useOverlayState()
    const [catatan,setCatatan] = useState('')
    const toast = useToast()

    const qc = useQueryClient()
    const subMutation = useMutation({
        mutationFn: (payload) => useOprasionalService.barequest(oprs.id, payload),
        onSuccess: () => {
            state.close()
            qc.invalidateQueries({queryKey: ['oprasional', oprs.id]})
            toast.success({message: 'Success', description: 'Permitaan proses BA berhasil.'})
        },
        onError: (err) => {
            toast.danger({message: 'Failed', description: err.message})
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        subMutation.mutate({catatan})
    }
    
    return (
        <ModalComponent
            state={state}
            buttonTrigger={<Button variant="danger" onPress={state.setOpen}>Request Proses BA</Button>}
            heading={'Request Proses BA'}
            hideFooter
        >
            <div className="mt-4 flex flex-col gap-3">
                <Label>Pastikan proses operasional sudah selesa. Apakah kamu yakin ingin melanjutkan proses?</Label>
                <form action="" onSubmit={handleSubmit}>
                    <TextArea required value={catatan} onChange={(e) => setCatatan(e.target.value)} variant="secondary" fullWidth placeholder="Catatan..." />
                    <div className="mt-6 flex justify-end gap-2">
                        <Button type="submit">Lanjutkan</Button>
                    </div>
                </form>
                
            </div>
        </ModalComponent>
    )
}

export default BARequestModal