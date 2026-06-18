import { Button, Checkbox, CheckboxGroup, Description, Label, ProgressBar, Spinner, Surface, useOverlayState } from "@heroui/react"
import ModalComponent from "../../../../../../components/modals/ModalComponent"
import InputText from "../../../../../../components/input/InputText"
import { useRef, useState } from "react"
import { api } from '../../../../../../lib/api'
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "../../../../../../lib/useToast"
import { CloudArrowUpIn } from "@gravity-ui/icons"

const UploadDocProgressModal = ({data=[], ops}) => {
    const state = useOverlayState()
    const [form, setForm] = useState({
        keterangan: '',
        item_penawaran: [],
        is_done: false
    })
    const [progress, setProgress] = useState(0)
    const fileRef = useRef(null)
    const qc = useQueryClient()
    const toast = useToast()

    const clean_data = data.filter(i => i.is_aggency_fee===false && i.progress < 100)

    const uploadFile = async (file, onProgress) => {
        
        const formData = new FormData()
        formData.append('file', file)
        formData.append('oprasional', ops)
        formData.append('keterangan', form.keterangan)
        formData.append('item_penawaran', form.item_penawaran)
        formData.append('is_done', form.is_done)

        const res = await api.post('/oprasional/upload-progress/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (e) => {
                const percent = Math.round((e.loaded * 100) / e.total)
                onProgress(percent)
            }
        })

        return res.data
    }

    const mutation = useMutation({
        mutationFn: async ({file, onProgress}) => {
            return await uploadFile(file, onProgress)
        },
        onSuccess: () => {
            state.close()
            setProgress(0)
            qc.invalidateQueries({queryKey: ['progress-list']})
        }
    })

    const handleUpload = () => {      
        const files = fileRef.current.files
        if (!files || files.length === 0) {
            toast.danger({message: 'Error', description: 'File cannot me empty.'})
            return
        }

        if (form.item_penawaran.length === 0) {
            toast.danger({message: 'Error', description: "Reference kegiatan harus dipilih."})
            return
        }
        mutation.mutate({file: fileRef.current.files[0], onProgress: setProgress})
    }


  return (
    <ModalComponent
        size={'lg'}
        state={state}
        buttonTrigger={<Button variant="secondary" onPress={state.setOpen}><CloudArrowUpIn /> Upload Progress</Button>}
        hideFooter
        hideHeader
    >
        <Surface className="space-y-4 mt-2 relative">
            <div className="">
                <CheckboxGroup
                    value={form.item_penawaran}
                    onChange={(e) => setForm({...form, item_penawaran: e})}
                >
                    <Label>Pilih pekerjaan:</Label>
                    {
                        clean_data.map(i => {
                            return (
                                <Checkbox isDisabled={i.progress === 100} key={i.id} value={i.id}>
                                    <Checkbox.Control>
                                        <Checkbox.Indicator />
                                    </Checkbox.Control>
                                    <Checkbox.Content>
                                        <div className="flex flex-col gap-1">
                                            <Label>{i.barang_jasa}</Label> 
                                            {
                                                i.keterangan && (
                                                    <Description>{i.keterangan}</Description>
                                                )
                                            }
                                        </div>

                                    </Checkbox.Content>
                                </Checkbox>

                            )
                        })
                    }
                </CheckboxGroup>
            </div>
            <div className="mb-1">
                <Label>Accepted document only .pdf & image</Label>
            </div>
            <div className="space-y-3">
                <input accept=".pdf" ref={fileRef} className="border-2 w-full p-2 border-dashed" type="file" />
                {
                    mutation.isPending && (
                        <ProgressBar size="sm" color="success" value={progress}>
                            <Label>Uploading...</Label>
                            <ProgressBar.Output />
                            <ProgressBar.Track>
                                <ProgressBar.Fill />
                            </ProgressBar.Track>
                        </ProgressBar>
                    )
                }
                <InputText value={form.keterangan} onChange={(e) => setForm({...form, keterangan: e.target.value})} placeholder="Keterangan" />
                <div className="">
                    <Checkbox value={form.is_done} onChange={(e) => setForm({...form, is_done:e})} >
                        <Checkbox.Control>
                            <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Content>
                            <Label>Pekerjaan Selesai</Label>
                        </Checkbox.Content>
                    </Checkbox>
                </div>
            </div>
            <div className="flex justify-end">
                <Button isDisabled={mutation.isPending} onPress={handleUpload}>Upload</Button>
            </div>
            {
                mutation.isPending && (
                    <div className="absolute inset-0 top-0 left-0 flex items-center justify-center">
                        <Spinner />
                    </div>
                )
            }
        </Surface>
    </ModalComponent>
  )
}

export default UploadDocProgressModal