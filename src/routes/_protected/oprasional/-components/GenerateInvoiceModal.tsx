import { Button, Surface, useOverlayState } from "@heroui/react"
import ModalComponent from "../../../../components/modals/ModalComponent"
import SubmitButton from "../../../../components/buttons/SubmitButton"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useInvoiceService } from "../../../../services/invoice/invoiceService"
import { useToast } from "../../../../lib/useToast"

const GenerateInvoiceModal = ({opr}) => {
    const state = useOverlayState()

    const toast = useToast()
    const qc = useQueryClient()
    const mutation = useMutation({
        mutationFn: (payload) => useInvoiceService.create(payload),
        onSuccess: (res) => {
            qc.invalidateQueries({queryKey: ['oprasional', opr?.id],})
            toast.success({message: 'Success', description: 'Invoice berhasil dibuat.'})
            state.close()
        },
        onError: (err) => {
            toast.danger({message: "Failed", description: err.message})
        }
    })

    const handleSubmit = () => {
        mutation.mutate({opr: opr?.id})
    }

    return (
        <ModalComponent
            state={state}
            buttonTrigger={<Button onPress={state.setOpen}>Generate Invoice</Button>}
            heading={'Generate Invoice'}
            hideFooter
        >
            <Surface>
                <form action="">
                    <div className="flex justify-end gap-1">
                        <Button variant="tertiary" onPress={state.close}>Close</Button>
                        <SubmitButton isLoading={mutation.isPending} onPress={handleSubmit} />
                    </div>
                </form>
            </Surface>
        </ModalComponent>
    )
}

export default GenerateInvoiceModal