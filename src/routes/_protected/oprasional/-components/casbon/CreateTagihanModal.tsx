import { Button, Label, ProgressBar, Spinner, TextArea, useOverlayState } from "@heroui/react"
import ModalComponent from "../../../../../components/modals/ModalComponent"
import DateInput from "../../../../../components/input/DateInput"
import InputText from "../../../../../components/input/InputText"
import CurrencyInput from "../../../../../components/input/CurrencyInput"
import { useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "@gravity-ui/icons"

import {api} from '../../../../../lib/api'
import { format } from "date-fns"

const CreateTagihanModal = ({casbonId, canEdit=false}) => {
    const today = new Date()
    const state = useOverlayState()
    const fileRef = useRef(null)
    const [progress, setProgress] = useState(0)


    const [form, setForm] = useState({
        casbon: casbonId,
        tgl_tagihan: format(today, 'yyyy-MM-dd'),
        nomor_tagihan: '',
        catatan: '',
        nilai_tagihan: 0
    })

    const qc = useQueryClient()

    const uploadFile = async (file, onProgress) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('casbon',   form.casbon)
        formData.append('tgl_tagihan', form.tgl_tagihan)
        formData.append('nomor_tagihan', form.nomor_tagihan)
        formData.append('catatan', form.catatan)
        formData.append('nilai_tagihan', form.nilai_tagihan)

        const res = await api.post('oprasional/tagihan/', formData, {
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

    const saveMutation = useMutation({
        mutationFn: async ({file, onProgress}) => {
            return await uploadFile(file, onProgress)
        },
        onSuccess: () => {
            setProgress(0)
            qc.invalidateQueries({queryKey: ['casbon-detail', casbonId]})
            qc.invalidateQueries({queryKey: ['tagihan-list']})
            setForm({...form,
                nomor_tagihan: '',
                catatan: '',
                nilai_tagihan: 0
            })
            state.close()
        }
    })


    const hanleSubmit = () => {      
        saveMutation.mutate({file:fileRef.current.files[0], onProgress: setProgress})
    }

    return (
        <ModalComponent
            size={'lg'}
            state={state}
            heading={'Input Tagihan'}
            hideFooter
            buttonTrigger={<Button isDisabled={!canEdit} onPress={state.setOpen} variant="ghost">
                <Plus />
                <span>Input Tagihan</span>
            </Button>}
        >
            <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-4">
                    <DateInput value={form.tgl_tagihan} onChange={(e) => setForm({...form, tgl_tagihan: e})} label={'Tanggal Invoice'} />
                    <InputText value={form.nomor_tagihan} onChange={(e) => setForm({...form, nomor_tagihan: e.target.value})} label={'Nomor Invoice / Tagihan'} placeholder="Opsional" />
                </div>
                <div className="">
                    <TextArea value={form.catatan} onChange={(e) => setForm({...form, catatan: e.target.value})} placeholder="* Catatan (opsional)" fullWidth />
                </div>
                <div className="flex">
                    <CurrencyInput value={form.nilai_tagihan} onChange={(e) => setForm({...form, nilai_tagihan: e})} label={'Nilai Invoice (Rp)'} />
                </div>
                <div className="relative">
                    <div className="mb-3">Upload Dok. Tagihan / Invoice</div>
                    <div className="mb-1">
                        <Label>Accepted document only .pdf & image</Label>
                    </div>
                    <div className="">
                        <input ref={fileRef} className="border-2 w-full p-2 border-dashed" type="file" 
                            // onChange={(e) => {mutation.mutate({file: e.target.files[0], onProgress: setProgress})}}
                         />
                    </div>
                    
                    {
                        progress >0 && (
                            <ProgressBar value={progress}>
                                <ProgressBar.Output />
                                <ProgressBar.Track>
                                    <ProgressBar.Fill />
                                </ProgressBar.Track>
                            </ProgressBar>

                        )
                    }
                    
                    {
                        saveMutation.isPending && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Spinner />
                            </div>
                        )
                    }
                </div>
                <div className="flex justify-end">
                    <Button isDisabled={saveMutation.isPending} onPress={hanleSubmit}>Simpan Tagihan</Button>
                </div>
            </div>

        </ModalComponent>
    )
}

export default CreateTagihanModal