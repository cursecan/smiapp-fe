import { Button, Surface, useOverlayState } from "@heroui/react"
import ModalComponent from "../../../../components/modals/ModalComponent"
import { useEffect, useState } from "react"
import DateInput from "../../../../components/input/DateInput"
import { useCustomerService } from "../../../../services/customer/customerService"
import SimpleComboBox from "../../../../components/input/SimpleComboBox"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSerahTerimaService } from "../../../../services/oprasional/serahTerimaService"
import { useToast } from "../../../../lib/useToast"
import { format } from "date-fns"
import DownloadButton from "../../../../components/buttons/DownloadButton"
import {api} from '../../../../lib/api'

const GenerateTandaTerimaModal = ({opr}) => {
    const state = useOverlayState()
    const [form, setForm] = useState({
        tgl_mulai: new Date(),
        customer_pemesan: '',
        customer_penerima: '',
        opr: opr.id
    })

    const toast = useToast()
    const qc = useQueryClient()

    const saveMutate = useMutation({
        mutationFn: (payload) => useSerahTerimaService.create(payload),
        onSuccess: async (res) => {
            await handleDownload(res?.data?.id)
        },
        onError: (err) => {
            toast.danger({message: 'Failed', description: err.message})
        }
    })

    const handleSave = () => {
        saveMutate.mutate(form)
    }

    const handleDownload = async (id) => {
            try {
                
                const res = await api.get(`/oprasional/ba-terima/${id}/download/`, {responseType: 'blob'})
               // const res = await fetch()
                const url = window.URL.createObjectURL(
                    new Blob([res.data])
                )
        
                const link = document.createElement('a')
        
                link.href = url
                link.setAttribute('download', `${id}.pdf`)
        
                document.body.appendChild(link)
        
                link.click()
            } finally {
                console.log('Finish');
                
            }
         }

    useEffect(() => {
        setForm({...form, tgl_mulai: format(new Date(), 'yyyy-MM-dd')})
    }, [])

    return (
        <ModalComponent
            state={state}
            heading={'Generate Tanda Terima'}
            size={'lg'}
            hideFooter
            buttonTrigger={<Button onPress={state.open} className={'bg-warning'}>Generate Tanda Terima</Button>}
        >
            <Surface className="space-y-3">
                {
                    !opr?.ba_terima && (
                        <>
                            <DateInput showReset={false} label={'Tanggal Kirim'} value={form.tgl_mulai} onChange={(e) => setForm({...form, tgl_mulai: e})} />
                            <SimpleComboBox
                                label={'Pemesan'}
                                fetchUrl={({pageParam, queryKey}) => useCustomerService.list({pageParam, queryKey})}
                                filter={(i) => ({...i, name: i.full_name, description: i.company?.company_name ?? ''})}
                                fetchDetailUrl={({queryKey}) => useCustomerService.detail(queryKey.at(1))}
                                query={['customer-combox']}
                                value={form?.customer_pemesan}
                                onChange={(e) => setForm({...form, customer_pemesan: e})}
                            />
                            <SimpleComboBox
                                label={'Penerima Barang'}
                                fetchUrl={({pageParam, queryKey}) => useCustomerService.list({pageParam, queryKey})}
                                filter={(i) => ({...i, name: i.full_name, description: i.company?.company_name ?? ''})}
                                fetchDetailUrl={({queryKey}) => useCustomerService.detail(queryKey.at(1))}
                                query={['customer-combox']}
                                value={form?.customer_penerima}
                                onChange={(e) => setForm({...form, customer_penerima: e})}
                            />
                        </>
                    )
                }
                <div className={`flex ${opr?.ba_terima ? 'justify-center' : 'justify-end'} items-center pt-10`}>
                    <Button onPress={handleSave}>
                        {
                            !opr?.ba_terima ? 'Save & Generate' : 'Download Tanda Terima'
                        }
                    </Button>
                </div>
            </Surface>
        
        </ModalComponent>
    )
}

export default GenerateTandaTerimaModal