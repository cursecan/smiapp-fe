import { Button, Checkbox, Label, Radio, RadioGroup, useOverlayState } from "@heroui/react"
import ModalComponent from "../../../../../components/modals/ModalComponent"
import { Plus } from "@gravity-ui/icons"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCashService, useRincianCashService } from "../../../../../services/oprasional/cashService"
import { useState } from "react"
import InputText from "../../../../../components/input/InputText"
import CurrencyInput from "../../../../../components/input/CurrencyInput"

const CreateModalRincian = ({pembayaran}) => {
    const state = useOverlayState()
    const [form, setForm] = useState({
        cashbon: pembayaran.id,
        kegiatan_penawaran: '',
        keterangan: '',
        qty: 1,
        satuan: '',
        harga_satuan: 0,
        is_header: false
    })
    const qc = useQueryClient()

    const mutation = useMutation({
        mutationFn: async (payload) => {
            return await useRincianCashService.create(payload)
        },
        onSuccess: (res) => {
            qc.invalidateQueries({
                queryKey: ['chashbon_item_list']
            })
            state.close()
        }
    })

    const handleCreate = () => {
        mutation.mutate(form)
    }
  
    return (
    <ModalComponent
        state={state}
        buttonTrigger={<Button onPress={state.setOpen}><Plus /> Barang / Jasa</Button>}
        iconComponent={<Plus className="size-5" />}
        size="lg"
        hideFooter
        hideHeader
    >
        <div className="space-y-6">
            <Checkbox defaultSelected={false} isSelected={form.is_header} onChange={(e) => setForm({...form, is_header: e})}>
                <Checkbox.Control>
                    <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                    <Label>Only Header</Label>
                </Checkbox.Content>
            </Checkbox>
            <InputText label={form.is_header ? 'Nama Header' : 'Kegiatan Barang / Jasa'} value={form.keterangan} onChange={(e) => setForm({...form, keterangan: e.target.value})} />
            {
                !form.is_header && (
                    <CurrencyInput label={'Nominal'} value={form.harga_satuan} onChange={(e) => setForm({...form, harga_satuan: e})} />
                )
            }
            <div className="flex justify-end gap-3">
                <Button variant="tertiary" slot={'close'}>
                    Close
                </Button>
                <Button onPress={handleCreate}>Simpan</Button>
            </div>
        </div>
    </ModalComponent>
  )
}

export default CreateModalRincian