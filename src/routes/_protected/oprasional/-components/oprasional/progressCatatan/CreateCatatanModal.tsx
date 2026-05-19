import { Button, Description, Label, Slider, Surface, useOverlayState } from "@heroui/react"
import ModalComponent from "../../../../../../components/modals/ModalComponent"
import { PencilToSquare } from "@gravity-ui/icons"
import { useEffect, useState } from "react"
import { useParams } from "@tanstack/react-router"
import InputText from "../../../../../../components/input/InputText"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCatatanOpsService } from "../../../../../../services/oprasional/catatanService"
import { useToast } from "../../../../../../lib/useToast"

const CreateCatatanModal = ({item}) => {
    const state = useOverlayState()
    const { id } = useParams({from: '/_protected/oprasional/oprasional/$id'})
    const [form, setForm] = useState({
        oprasional: id,
        item_penawaran: item.id,
        keterangan: '',
        progress: 0
    })

    const toast = useToast()
    const qc = useQueryClient()

    const save_mutation = useMutation({
        mutationFn: async (payload) => {
            return await useCatatanOpsService.create(payload)
        },
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['catatan-list']})
            toast.success({message: 'Berhasil', description: 'Catatan berhasil disimpan.'})
            state.close()
        }
    })


    const handleSubmit = () => {
        save_mutation.mutate(form)
    }


    useEffect(() => {
        if (item) {
            setForm({...form, progress: item.progress, item_penawaran: item.id})
        }
    }, [item])

  return (
    <ModalComponent
        state={state}
        buttonTrigger={
            <Button onPress={state.setOpen} isIconOnly size="sm" variant="tertiary">
                <PencilToSquare />
            </Button>
        }
        heading={'Input Progress Pekerjaan'}
        hideFooter
    >

        <Surface>
            <Description>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellendus, nisi!
            </Description>
            <div className="mt-6 flex flex-col gap-4">
                <Slider value={form.progress} onChange={(e) => setForm({...form, progress: e})} className="w-full max-w-xs" defaultValue={0}>
                    <Slider.Output />
                    <Label>Progress %</Label>
                    <Description>Lorem ipsum dolor sit amet.</Description>
                    <Slider.Track>
                        <Slider.Fill />
                        <Slider.Thumb />
                    </Slider.Track>
                </Slider>
                <InputText value={form.keterangan} onChange={(e) => setForm({...form, keterangan: e.target.value})} placeholder="Tulis catatan." />
                <input type="file" className="p-4 rounded-xl border-2 border-dashed" />
                <div className="flex items-center justify-end gap-2">
                    <Button onPress={state.close} variant="tertiary">Batal</Button>
                    <Button onPress={handleSubmit}>Simpan</Button>
                </div>
            </div>
        </Surface>
    </ModalComponent>
  )
}

export default CreateCatatanModal