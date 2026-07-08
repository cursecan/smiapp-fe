import { Button, CloseButton, TextArea, useOverlayState } from "@heroui/react"
import ModalComponent from "../../../../../components/modals/ModalComponent"
import { PencilToLine } from "@gravity-ui/icons"
import { useState } from "react"
import DateInput from "../../../../../components/input/DateInput"
import InputText from "../../../../../components/input/InputText"
import CurrencyInput from "../../../../../components/input/CurrencyInput"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTagihanCabonService } from "../../../../../services/oprasional/tagihanCasbonService"
import SelectComponent from "../../../../../components/input/SelectComponent"

const UpdateTagihanModal = ({item, canEdit=false}) => {
    const state = useOverlayState()
    const [form, setForm] = useState({...item})

    const qc = useQueryClient()

    // const {data} = useQuery({
    //     queryKey: ['tagihan-detail', item?.id],
    //     queryFn: () => useTagihanCabonService.detail(item?.id),
    //     select: (res) => res.data,
    //     enabled: !!item?.id
    // })

    const saveMutation = useMutation({
        mutationFn: (payload) => useTagihanCabonService.update(item.id, payload),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['casbon-detail']})
            qc.invalidateQueries({queryKey: ['tagihan-list']})
            
            state.close()
        }
    })


    const hanleSubmit = () => {      
        saveMutation.mutate(form)
    }


    return (
        <ModalComponent
            size={'lg'}
            state={state}
            buttonTrigger={
                <CloseButton isDisabled={!canEdit} onPress={state.setOpen} className={'bg-accent text-white'}>
                    <PencilToLine />
                </CloseButton>
            }
        >
            <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-4">
                    <DateInput value={form.tgl_tagihan} onChange={(e) => setForm({...form, tgl_tagihan: e})} label={'Tanggal Invoice'} />
                    <InputText value={form.nomor_tagihan} onChange={(e) => setForm({...form, nomor_tagihan: e.target.value})} label={'Nomor Invoice / Tagihan'} placeholder="Opsional" />
                </div>
                <div className="">
                    <TextArea value={form.catatan} onChange={(e) => setForm({...form, catatan: e.target.value})} placeholder="* Catatan (opsional)" fullWidth />
                </div>
                <div>
                    <CurrencyInput value={form.nilai_tagihan} onChange={(e) => setForm({...form, nilai_tagihan: e})} label={'Total Tagihan (Rp)'} />
                </div>
                <div className="flex">
                    <CurrencyInput variant='secondary' value={form.nilai_dasar_pajak} onChange={(e) => setForm({...form, nilai_dasar_pajak: e})} label={'* Nilai Dasar Kena Pajak'} />
                </div>
                <div className="flex items-center gap-3">
                    <SelectComponent label={'* PPn'} value={form.ppn_rate} onChange={(e) => setForm({...form, ppn_rate: e})} data={[{id: 0, label: 'Non PPn'}, {id: 0.11, label: 'PPn 11%'}]} />
                    <SelectComponent label={'Potongan PPh'} value={form.pph_rate} onChange={(e) => setForm({...form, pph_rate: e})} data={[{id: 0, label: 'Non PPh'}, {id: 0.025, label: 'PPh Perorangan (2.5%)'}, {id: 0.020, label: 'PPh Badan (2.0%)'}]} />
                </div>
                {/* <div className="relative">
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
                </div> */}
                <div className="flex justify-end">
                    <Button isDisabled={saveMutation.isPending} onPress={hanleSubmit}>Simpan Tagihan</Button>
                </div>
            </div>
        </ModalComponent>
    )
}

export default UpdateTagihanModal