
import { Button, Card, Checkbox, Description, Label, ProgressBar, Spinner, Surface, Table, Tag, TagGroup, useOverlayState } from "@heroui/react"
import { formatRupiah } from "../../../../../utils/formatCurrency"
import ModalComponent from "../../../../../components/modals/ModalComponent"
import CurrencyInput from "../../../../../components/input/CurrencyInput"
import { useRef, useState } from "react"
import { useParams } from "@tanstack/react-router"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useExpenseService } from "../../../../../services/keuangan/expenseService"
import { useToast } from "../../../../../lib/useToast"
import StatusChiper from "../../../../../components/StatusChiper"
import { useCasbonService } from "../../../../../services/oprasional/casbonService"
import ItemList from "./item/ItemList"
import DrawerComponent from "../../../../../components/DrawerComponent"
import CheckboxInput from "../../../../../components/input/CheckboxInput"

import { api } from '../../../../../lib/api'


const CasbonItem = ({item}) => {
    const { id } = useParams({from: '/_protected/keuangan/expense/$id'})
    const state = useOverlayState()
    const expanse_state = useOverlayState()
    const [progress, setProgress] = useState(0)
    const fileRef = useRef(null)

    const [form, setForm] = useState({
        exp_oprasional: id,
        casbon: item?.id,
        amount: 0,
        biaya_lainya: 0
    })
    const file_name = `FOFIN.${item?.nomor.replace(/\//g, '_')}.pdf`
    
    const toast = useToast()
    const qc = useQueryClient()

    const {data: casbonItem} = useQuery({
        queryKey: ['item-casbon-list', item?.id],
        queryFn: () => useCasbonService.items(item?.id),
        select: (res) => res.data,
        enabled: !!item?.id && !!state.isOpen
    })

    const saveBuktiTransfer = async (file, onProgress) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('exp_oprasional', id)
        formData.append('casbon', item.id)
        formData.append('amount', form.amount)
        formData.append('biaya_lainya', form.biaya_lainya)

        const res = await api.post('/keuangan/expense/', formData, {
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

    const save_mutation = useMutation({
        mutationFn: async ({file, onProgress}) => {
            return await saveBuktiTransfer(file, onProgress)
        },
        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ['exp-oprasiona-detail']
            })
            expanse_state.close()
            setForm({...form, amount: 0, biaya_lainya: 0})
            toast.success({message: 'Success', description: 'Update expese sukses.'})
            fileRef.current.value = ''
        },
        onError: (err) => {
            toast.danger({message: 'Erros', description: err.message})
            fileRef.current.value = ''
        }
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!fileRef.current?.files?.length) {
            alert('Bukti transfer belum dilamirkan.')
            return;
        }

        const file = fileRef.current.files[0]
        save_mutation.mutate({file: file, onProgress: setProgress})
        
        // save_mutation.mutate(form)
    }

    

  return (
    <>
        <Table.Row>
            <Table.Cell>
                <div className="flex flex-col">
                    <Label>{item.nomor}</Label>
                    <div className="mt-1">
                        <TagGroup>
                            <TagGroup.List>
                                { item.pembayaran && <Tag className={'bg-accent-soft text-accent'}>Pembayaran</Tag>}
                                { item.casbon && <Tag className={'bg-warning-soft text-orange-500'}>Casbon</Tag>}
                                { item.petycash && <Tag className={'bg-success-soft text-success'}>Petty Cash</Tag>}
                            </TagGroup.List>
                        </TagGroup>
                    </div>
                    {/* <DownloadButton filename={file_name} fetch={async () => await api.get(`oprasional/casbon/${item.id}/preview/`,  {responseType: 'blob'})} /> */}
                </div>
            </Table.Cell>
            <Table.Cell>
                {formatRupiah(item.grand_total)}
            </Table.Cell>
            <Table.Cell>
                {formatRupiah(item.total_expense.total)}
            </Table.Cell>
            <Table.Cell>
                {formatRupiah(item.total_expense.total_lainya)}
            </Table.Cell>
            <Table.Cell className={'truncate'}>
                <StatusChiper status={item.status} />
            </Table.Cell>
            <Table.Cell>
                <DrawerComponent state={state} heading={item.nomor} buttonTrigger={
                    <Button onPress={state.setOpen}>Action</Button>
                }
                    footerButtons={(
                        <div className="flex gap-3">
                            {
                                item.total_expense < item.grand_total && (
                                    <Button onPress={expanse_state.setOpen}>Upload Bukti Transfer</Button>
                                )
                            }
                        </div>
                    )}
                >  
                    <div className="space-y-5 flex flex-col">
                        <Label>{item.nama_project}</Label>
                        <div className="flex gap-4">
                            <CheckboxInput label={'Pembayaran'} value={!!item.pembayaran} />
                            <CheckboxInput label={'Casbon'} value={!!item.casbon} />
                            <CheckboxInput label={'Petty Cash'} value={!!item.petty_cash} />
                        </div>
                        <div className="flex gap-4">
                            <CheckboxInput label={'Transfer'} value={item.type_pembayaran==='TF'} />
                            <CheckboxInput label={'Cash'} value={item.type_pembayaran==='CA'} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Description>Pemohon</Description>
                            <Label>{item.create_by.full_name} { item.create_by.pegawai && <span>({item.create_by.pegawai.jabatan})</span>}</Label>
                        </div>
                        <div className="flex items-center">
                            <div className="flex flex-col gap-1 flex-1">
                                <Description>Supplier</Description>
                                <Label>{item.supplier.company ? item.supplier.company.company_name : item.supplier.full_name}</Label>
                            </div>
                            <div className="flex flex-col gap-1 flex-1">
                                <Description>No. NPWP</Description>
                                <Label>-</Label>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 flex-1">
                            <Description>Rekening</Description>
                            <Label className="uppercase">{item.bank_rekening??'-'} {item.nama_rekening??'-'}</Label>
                        </div>
                        <ItemList casbon={item} data={casbonItem} />
                    </div>

                </DrawerComponent>

                <ModalComponent
                    state={expanse_state}
                    hideFooter
                >
                    <Surface>
                        <form action="" onSubmit={handleSubmit} className="mt-5 space-y-6">
                            <CurrencyInput value={form.amount} onChange={(e) => setForm({...form, amount: e})} label={'Nominal Transfer'} />
                            <CurrencyInput value={form.biaya_lainya} onChange={(e) => setForm({...form, biaya_lainya: e})} label={'Biaya Lain lain'} />
                             <div className="relative">
                                <div className="mb-1">
                                    <Label>Accepted document only .pdf & image</Label>
                                </div>
                                <div className="">
                                    <input ref={fileRef} className="border-2 w-full p-2 border-dashed" type="file"/>
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
                                    save_mutation.isPending && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Spinner />
                                        </div>
                                    )
                                }
                            </div>
                            
                            <div className="flex justify-end gap-2">
                                <Button type="button" onPress={expanse_state.close} variant="tertiary">Close</Button>
                                <Button type="submit">Submit</Button>
                            </div>
                        </form>
                    </Surface>
                </ModalComponent>
            </Table.Cell>
        </Table.Row>
    


    {/* <Card>
        <Card.Header>
            <div className="flex justify-between items-center">
                <Card.Title>
                    <b>{item.nomor}</b>
                </Card.Title>
            </div>
        </Card.Header>
        <Card.Content>
            <div className="flex items-center gap-6">
                <div className="flex flex-1 items-center gap-10">
                    <Checkbox isSelected={item.pembayaran}>
                        <Checkbox.Control>
                            <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Content>
                            <Label>Pembayaran</Label>
                        </Checkbox.Content>
                    </Checkbox>
                    <Checkbox isSelected={item.casbon}>
                        <Checkbox.Control>
                            <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Content>
                            <Label>Casbon</Label>
                        </Checkbox.Content>
                    </Checkbox>
                    <Checkbox isSelected={item.petty_cash}>
                        <Checkbox.Control>
                            <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Content>
                            <Label>Petty Cash</Label>
                        </Checkbox.Content>
                    </Checkbox>
                </div>
                <div className="flex flex-col gap-1">
                    <Description>Total Casbon</Description>
                    <Label>{formatRupiah(item.grand_total)}</Label>
                </div>
                <StatusChiper status={item.status} />
                <div className="">
                    <ModalComponent
                        size={'lg'}
                        heading={'Upload Bukti Trasnfer'}
                        state={state}
                        buttonTrigger={<Button isDisabled={item.total_expense >= item.grand_total} onPress={state.setOpen}>Actions</Button>}
                        hideFooter
                    >
                        <Surface className="py-1">
                            <Label>Telah dilakukan transfer untuk pengeluaran ...</Label>

                            <form action="" onSubmit={handleSubmit} className="mt-5 space-y-6">
                                <CurrencyInput value={form.amount} onChange={(e) => setForm({...form, amount: e})} label={'Nominal Transfer'} />
                                <CurrencyInput value={form.biaya_lainya} onChange={(e) => setForm({...form, biaya_lainya: e})} label={'Biaya Lain lain'} />
                                <div className="flex justify-end gap-2">
                                    <Button type="button" onPress={state.close} variant="tertiary">Close</Button>
                                    <Button type="submit">Submit</Button>
                                </div>
                            </form>
                        </Surface>
                    </ModalComponent>
                </div>
            </div>
            <div className="">
                <DownloadButton filename={file_name} fetch={async () => await api.get(`oprasional/casbon/${item.id}/preview/`,  {responseType: 'blob'})} />
            </div>
        </Card.Content>
    </Card> */}
    </>
  )
}

export default CasbonItem