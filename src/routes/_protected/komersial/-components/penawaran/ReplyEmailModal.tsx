import { Button, Description, Label, Surface, TextArea, useOverlayState } from "@heroui/react"
import ModalComponent from "../../../../../components/modals/ModalComponent"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "../../../../../lib/useToast"
import InputText from "../../../../../components/input/InputText"
import { useEffect, useState } from "react"

const ReplyEmailModal = ({payload, fnQuery, queryKey, isDisabled=false}) => {
    const state = useOverlayState()
    const toast = useToast()

    const [data, setData] = useState({
        subject: '',
        body: '',
        email_to: ''
    })

    const qc  = useQueryClient()
    const mutation = useMutation({
        mutationFn: fnQuery,
        onSuccess: (res) => {
            qc.invalidateQueries([...queryKey])
            state.close()
            toast.success({message: 'Berhasil.', description: "Penawaran berhasil dikirimkan."})
        },
        onError: (er) => {
            state.close()
            toast.danger({message: 'Error', description: er.message})
        }
    })

    const handleSubmit = () => {
        mutation.mutate(data)
    }

    useEffect(() => {
        if (payload && payload.sumber_penugasan) {
            const re_subject = `Re: ${payload.sumber_penugasan.subject}`
            const email_to = payload.sumber_penugasan.customer?.email || ''
            const company = payload.sumber_penugasan?.customer?.company?.company_name || ''
            const full_name = payload.sumber_penugasan?.customer?.full_name
            const body = `Kepada Yth.\n${company}\n${full_name}\n\nBerikut kami kirimkan Penawaran Harga ${payload.nama_project}`

            setData({...data, subject: re_subject, email_to: email_to, body: body})
        }   
    }, [payload])

  return (
    <ModalComponent
        buttonTrigger={<Button isDisabled={isDisabled} onPress={state.setOpen} variant='secondary'>Re. Email Penawaran</Button>}
        state={state}
        size={'lg'}
        hideFooter
        heading={'Reply Email Penawaran'}
    >

        <Surface>
            {/* <Description>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae, rem?</Description> */}
            <div className="mt-6 space-y-6">
                <InputText value={data.email_to} onChange={(e) => setData({...data, email_to: e.target.value})} label={'Reply To'} />
                <InputText value={data.subject} onChange={(e) => setData({...data, subject: e.target.value})} label={'Subject'} />
                <div className="flex flex-col gap-2">
                    <Label>Message</Label>
                    <TextArea value={data.body} onChange={(e) => setData({...data, body: e.target.value})} fullWidth rows={6} />
                </div>
                <div className="flex justify-end gap-2">
                    <Button onPress={state.close} variant="tertiary">Batal</Button>
                    <Button onPress={handleSubmit}>Kirim</Button>
                </div>
            </div>
        </Surface>

    </ModalComponent>
  )
}

export default ReplyEmailModal