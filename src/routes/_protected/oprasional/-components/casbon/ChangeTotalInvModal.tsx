import { Button, CloseButton, useOverlayState } from "@heroui/react"
import ModalComponent from "../../../../../components/modals/ModalComponent"
import { useState } from "react"
import { FileDollar } from "@gravity-ui/icons"
import CurrencyInput from "../../../../../components/input/CurrencyInput"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCasbonService } from "../../../../../services/oprasional/casbonService"
import { useToast } from "../../../../../lib/useToast"


const ChangeTotalInvModal = ({casbon, invInit=0}) => {
    const state = useOverlayState()
    const [invoice, setInvoice] = useState(invInit)

    const qc = useQueryClient()
    const toast = useToast()

    const mutation = useMutation({
        mutationFn: (payload) => useCasbonService.change_invoice(casbon?.id, payload),
        onSuccess: (res) => {
            qc.invalidateQueries({queryKey: ['casbon-detail', casbon?.id]})
            state.close()
        },
        onError: (err) => {
            toast.danger({message: 'Failed', description: err.message})
        }
    })

    const handleSave = (e) => {
        e.preventDefault()
        mutation.mutate({nilai_invoice: invoice})
    }

  return (
    <ModalComponent
        state={state}
        heading={'Change Total Invoice'}
        hideFooter
        buttonTrigger={<CloseButton onPress={state.setOpen} className={'bg-green-500 text-white'}><FileDollar /></CloseButton>}
    >
        <div className="">
            <form action="" onSubmit={handleSave}>
                <CurrencyInput value={invoice} onChange={(e) => setInvoice(e)} />
                <div className="flex gap-2 justify-end mt-4">
                    <Button type="submit">Simpan</Button>
                </div>
            </form>
        </div>
    </ModalComponent>
  )
}

export default ChangeTotalInvModal