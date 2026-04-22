import { Button, Input, Label, Surface, TextField } from "@heroui/react"
import SelectComponent from "../../../../../components/input/SelectComponent"
import KapalSelect from "../../../../../components/input/KapalSelect"
import CustomerSelect from "../../../../../components/input/CustomerSelect"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { usePenawaranService } from "../../../../../services/penawaran.service"
import { useCustomerService } from "../../../../../services/customer/customerService"
import { useNavigate } from "@tanstack/react-router"

const CreatePenawaranForm = ({pesanan, state}) => {
    const [form, setForm] = useState({
        nama_project: pesanan?.subject || '',
        customer: pesanan?.customer?.id || '',
        kapal: [],
        judul_penugasan: '',
        nomor_penugasan: '',
        sumber_penugasan: pesanan?.id || '',
    })
    const navigate = useNavigate()

    const qc = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (payload) => {
            if (pesanan && !pesanan.customer) {
                const res = await useCustomerService.create({full_name: pesanan.email_from, email: pesanan.email_from})
                // insert new customer
                return await usePenawaranService.create({...payload, customer: res.data.id})
            }
            return await usePenawaranService.create(payload)
        },
        onSuccess: (res) => {
            qc.invalidateQueries({queryKey: ['penawaran-list']})
            state.close()
            
            navigate({to: `/komersial/penawaran/${res.data.id}`})
        }
    })


  return (
    <div className="">

        <Surface className="p-4">
            <form action="" className="space-y-6">
                <TextField isRequired>
                    <Label>Nama Project</Label>
                    <Input value={form.nama_project} onChange={e=>setForm({...form, nama_project: e.target.value})} />
                </TextField>
                <TextField>
                    <Label>Nomor PO/SPK</Label>
                    <Input value={form.nomor_penugasan} onChange={e=>setForm({...form, nomor_penugasan: e.target.value})} />
                </TextField>
                {/* <TextField isRequired>
                    <Label>Surat Pesanan</Label>
                    <Input value={form.judul_penugasan} onChange={e=>setForm({...form, judul_penugasan: e.target.value})} />
                </TextField> */}
                {/* <TextField isRequired>
                    <Label>Wilayah</Label>
                    <Input />
                </TextField>
                <KapalSelect onChange={(e) => setForm({...form, kapal:e})} /> */}
                {
                    !pesanan && <CustomerSelect onChange={(e) => setForm({...form, customer:e})} />
                }
            </form>
        </Surface>
        <div className="flex justify-end items-center gap-2">
            <Button variant="tertiary" onPress={state.close}>Close</Button>
            <Button onPress={() => mutation.mutate(form)}>Submit</Button>
        </div>
    </div>
  )
}

export default CreatePenawaranForm