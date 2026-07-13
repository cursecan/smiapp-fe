import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useItemBastService } from "../../../../../services/oprasional/bastService"
import { useEffect, useState } from "react"
import { Button, CloseButton, Surface, TextArea, useOverlayState } from "@heroui/react"
import ModalComponent from "../../../../../components/modals/ModalComponent"
import { PencilToSquare } from "@gravity-ui/icons"
import CurrencyInput from "../../../../../components/input/CurrencyInput"
import SimpleComboBox from "../../../../../components/input/SimpleComboBox"
import { useSatuanService } from "../../../../../services/masterdata/satuanService"
import { useToast } from "../../../../../lib/useToast"

const UpdateItemBastModal = ({item}) => {
    const [form, setForm] = useState()
    const state = useOverlayState()
    const toast = useToast()

    const qc = useQueryClient()

    const {data} = useQuery({
        queryKey: ['itembast-detail', item?.id],
        queryFn: () => useItemBastService.detail(item?.id),
        select: (res) => res.data,
        enabled: !!item?.id && !!state.isOpen
    })

    const save_mutation = useMutation({
        mutationFn: (payload) => useItemBastService.update(item?.id, payload),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['bast-items']})
            state.close()
        },
        onError: (err) => {
            toast.danger({message: 'Failed', description: err.message})
        }
    })



    useEffect(() => {
        if (data) {
            setForm({...data})
        }
    }, [data])


  return (
    <ModalComponent
        state={state}
        buttonTrigger={<CloseButton onPress={state.setOpen}><PencilToSquare /></CloseButton>}
        size={'lg'}
        hideFooter
    >
        <form action="" className="mt-6" onSubmit={(e) => {e.preventDefault(); save_mutation.mutate(form)}}>
            <Surface className="flex flex-col gap-4 p-3 rounded-2xl" variant="secondary">
                <TextArea fullWidth value={form?.rincian_pekerjaan} onChange={(e) => setForm({...form, rincian_pekerjaan:e.target.value})} />
                <div className="flex gap-4">
                    <CurrencyInput className={'w-16'} label={'Kuantitas'} value={form?.qty} onChange={e => setForm({...form, qty:e})} />
                    <SimpleComboBox
                        label={'Satuan'}
                        query={['satuan-combox-list']}
                        fetchUrl={() => useSatuanService.list()}
                        fetchDetailUrl={({queryKey}) => useSatuanService.detail(queryKey.at(1))}
                        filter={(i) => ({...i, name: i.nama_satuan})}
                        value={form?.satuan}
                        onChange={(e) => setForm({...form, satuan: e})}
                    />
                </div>
                <div className="flex">
                    <CurrencyInput
                        label={'Harga Satuan'}
                        value={form?.harga_satuan}
                        onChange={(e) => setForm({...form, harga_satuan: e})}
                    />
                </div>
                <TextArea value={form?.catatan} onChange={e => setForm({...form, catatan: e.target.value})} placeholder="Keterangn..."/>
            </Surface>
            <div className="flex justify-end gap-3 mt-3">
                <Button type="submit">Simpan Perubahan</Button>
            </div>
        </form>
    </ModalComponent>
  )
}

export default UpdateItemBastModal