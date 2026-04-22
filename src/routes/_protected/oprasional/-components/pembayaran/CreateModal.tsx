
import ModalComponent from '../../../../../components/modals/ModalComponent'
import { Button, useOverlayState } from '@heroui/react'
import { FloppyDisk, Plus, TagDollar } from '@gravity-ui/icons'
import PenawaranComboBox from '../../../../../components/input/PenawaranComboBox'
import InputText from '../../../../../components/input/InputText'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCashService } from '../../../../../services/oprasional/cashService'
import { useNavigate } from '@tanstack/react-router'

const CreateModal = () => {
    const state = useOverlayState()
    const [form, setForm] = useState({
        keterangan: '',
        penawaran: '',
        nomor_spk: '',
        due_date: '',
        pemohon: '',
        no_rekening: '',
        bank: '',
        nama_penerima: '',
        jenis_pembayaran: '',
        no_invoice: '',
        catatan: ''
    })

    const navigate = useNavigate()

    const qc = useQueryClient()
    const mutation_create = useMutation({
        mutationFn: async (payload) => {
            return await useCashService.create(payload)
        },
        onSuccess: (res) => {
            qc.invalidateQueries({queryKey: ['cashbon-list']})
            state.close
            navigate({to: `/oprasional/pembayaran/${res.data.id}`})
        }
    })

    const handleSave = () => {
        mutation_create.mutate(form)
        // console.log(form);
    }


  
    return (
    <ModalComponent
        state={state}
        buttonTrigger={<Button onPress={state.setOpen}><Plus /> Buat Pengajuan</Button>}
        heading={'Pengajuan Cashbon'}
        iconComponent={<TagDollar className='size-5 text-orange-500' />}
        size="lg"
        hideHeader
        hideFooter
    >
        <div className="space-y-6">
            <InputText value={form.keterangan} onChange={(e) => setForm({...form, keterangan:e.target.value})} label={'Keterangan'} />
            <PenawaranComboBox value={form.penawaran} onChange={(e) => setForm({...form, penawaran: e})} />
            <div className="flex gap-3 justify-end">
                <Button slot={'close'} variant='tertiary'>Batal</Button>
                <Button onPress={handleSave}><FloppyDisk /> Simpan</Button>
            </div>
        </div>
    </ModalComponent>
  )
}

export default CreateModal