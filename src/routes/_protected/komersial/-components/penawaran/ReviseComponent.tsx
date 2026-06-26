import { Button, Surface, useOverlayState } from "@heroui/react"
import ModalComponent from "../../../../../components/modals/ModalComponent"
import { useMutation } from "@tanstack/react-query"
import { usePenawaranService } from "../../../../../services/penawaran.service"
import { useNavigate } from "@tanstack/react-router"
import InputText from "../../../../../components/input/InputText"
import { useState } from "react"

const ReviseComponent = ({penawaran}) => {
    const navigate = useNavigate()
    const [form, setForm] = useState({...penawaran})

    const state = useOverlayState()
    const mutation = useMutation({
        mutationFn: (payload) => usePenawaranService.revise(payload),
        onSuccess: (res) => {
            console.log(res);
            
            navigate({to: `/komersial/penawaran/${res.data.id}`})
        }
    })

    const handleRevise = () => {
        mutation.mutate({ex_penawaran: form.nomor})
    }


  return (
    <ModalComponent 
        state={state}
        buttonTrigger={<Button variant="danger" onPress={state.setOpen}>Revisi</Button>}
        hideFooter
        hideHeader
    >
        <Surface className="mt-6 p-0.5">
            <form action="" className="flex flex-col gap-3">
                <InputText label={'Nomor Penawaran Lama'} value={form.nomor} isDisabled />
                <div className="flex justify-end">
                    <Button type="button" onPress={handleRevise} variant="danger">Revisi</Button>
                </div>
            </form>
        </Surface>
    </ModalComponent>
  )
}

export default ReviseComponent