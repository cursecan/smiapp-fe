import { Button, Card, Checkbox, CloseButton, Label, Surface, Table, Tabs, TextArea } from "@heroui/react"
import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useBastService } from "../../../../../services/oprasional/bastService"
import { formatRupiah } from "../../../../../utils/formatCurrency"
import DateInput from "../../../../../components/input/DateInput"
import SimpleComboBox from "../../../../../components/input/SimpleComboBox"
import { useCustomerService } from "../../../../../services/customer/customerService"
import { usePegawayService } from "../../../../../services/masterdata/pegawayService"
import DownloadBAST from "../DownloadBAST"
import UpdateItemBastModal from "./UpdateItemBastModal"
import { useToast } from "../../../../../lib/useToast"
import UploadInput from "../../../../../components/input/UploadInput"
import GenerateInvoiceModal from "../GenerateInvoiceModal"
import { Check } from "@gravity-ui/icons"
import ApprovalButtons from "../../../../../components/buttons/ApprovalButtons"
import { useOprasionalService } from "../../../../../services/oprasional/oprasionalService"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useOperasionalSchema } from "../../../../../schemas/penawaranSchema"
import SubmitButton from "../../../../../components/buttons/SubmitButton"


const TabBast = ({opr, canEdit=false}) => {
    const [form, setForm] = useState()
    const [selectedKeys, setSelectedKeys] = useState(new Set());
    const toast = useToast()
    const {control, handleSubmit, reset, getValues, formState: {isValid}} = useForm({resolver: zodResolver(useOperasionalSchema), mode: "onChange", defaultValues: opr || {}})

    

    const {data:  bast} = useQuery({
        queryKey: ['bast-detail', opr?.bast],
        queryFn: () => useBastService.detail(opr?.bast),
        select: (res) => res.data,
        enabled: !!opr?.bast
    })

    const {data:  items} = useQuery({
        queryKey: ['bast-items', opr?.bast],
        queryFn: () => useBastService.items(opr?.bast),
        select: (res) => res.data,
        enabled: !!opr?.bast
    })


    const qc = useQueryClient()

    const save_mutation = useMutation({
        mutationFn: (payload) => useBastService.update(opr?.bast, payload),
        onSuccess: () => {
            toast.success({message: 'Success', description: 'Perubahan berhasil disimpan.'})
            qc.invalidateQueries({queryKey: ['bast-detail', opr?.bast]})
            qc.invalidateQueries({queryKey: ['bast-items', opr?.bast]})
        },
        onError: (err) =>  {
            toast.danger({message: 'Failed', description: err.message})
        }
    })


    const submitSave = () => {
        save_mutation.mutate({...form, selected: [...selectedKeys]})
    }



    useEffect(() => {
        if (bast) {
            setForm(bast)
        }
    }, [bast])

    useEffect(() => {
        if (items) {
            setSelectedKeys(
                new Set(items.filter(i => i.is_checked).map(i => i.id))
            )
        }
    }, [items])

    // useEffect(() => {
    //     if (userappovals) {
    //         setApprobals(userappovals)
    //     }
    // }, [userappovals])
    


  return (
    <Tabs.Panel id={'ba'} className='space-y-4'>
        <Surface className="p-3 rounded-2xl space-y-3" variant='secondary'>
            <TextArea fullWidth readOnly={!canEdit} value={form?.pekerjaan} onChange={(e) => setForm({...form, pekerjaan: e.target.value})} />
            <div className="flex gap-3">
                <DateInput isReadOnly={!canEdit} label={'Mulai'} value={form?.tgl_mulai} onChange={(e) => setForm({...form, tgl_mulai: e})} />
                <DateInput isReadOnly={!canEdit} label={'Selesai'} value={form?.tgl_selesai} onChange={(e) => setForm({...form, tgl_selesai: e})} />
            </div>
            <SimpleComboBox
                isDisabled={!canEdit}
                label={'Customer / Pemohon Pekerjaan'}
                fetchUrl={({pageParam, queryKey}) => useCustomerService.list({pageParam, queryKey})}
                filter={(i) => ({...i, name: i.full_name, description: i.company?.company_name ?? ''})}
                fetchDetailUrl={({queryKey}) => useCustomerService.detail(queryKey.at(1))}
                query={['customer-combox']}
                value={form?.customer}
                onChange={(e) => setForm({...form, customer: e})}
            />
            <Surface className="rounded-xl">
                {
                    bast?.penanggung_jawab.map((value, index) => {
                        return (
                            <div key={index} className="p-3">
                                <SimpleComboBox
                                    label={`Pemimipin ${index+1}`}
                                    fetchUrl={({pageParam, queryKey}) => usePegawayService.list({pageParam, queryKey})}
                                    filter={(i) => ({...i, name: i.user.full_name, description: i.jabatan.nama_jabatan ?? ''})}
                                    fetchDetailUrl={({queryKey}) => usePegawayService.detai(queryKey.at(1))}
                                    query={['direksi-combox']}
                                    value={value}
                                    isDisabled
                                />
                            </div>
                        )
                    })
                }
            </Surface>
        </Surface>

        <Table>
            <Table.ScrollContainer>
                <Table.Content
                    selectedKeys={selectedKeys}
                    selectionMode="multiple"
                    onSelectionChange={setSelectedKeys}
                >
                    <Table.Header>
                        <Table.Column isRowHeader>
                            Detail Pekerjaan
                        </Table.Column>
                        <Table.Column>Qty</Table.Column>
                        <Table.Column>Satuan</Table.Column>
                        <Table.Column>Harga Satuan</Table.Column>
                        <Table.Column>Jumlah</Table.Column>
                        <Table.Column>Check</Table.Column>
                        <Table.Column>Keterangan</Table.Column>
                        <Table.Column></Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {
                            items?.map(i => {
                                return (
                                <Table.Row key={i.id} id={i.id}>
                                    {
                                        i.is_header ? (
                                            <Table.Cell colSpan={8}>
                                                <strong>{i.rincian_pekerjaan}</strong>
                                            </Table.Cell>
                                        ) : (
                                            <>
                                                <Table.Cell>
                                                    <div className={i.code.slice(2,4)!=='00' && 'pl-4 font-light'}>{i.rincian_pekerjaan}</div>
                                                </Table.Cell>
                                                <Table.Cell>{i.qty}</Table.Cell>
                                                <Table.Cell>{i.satuan_name}</Table.Cell>
                                                <Table.Cell>
                                                    <div className="flex justify-between">
                                                        Rp <span>{formatRupiah(i.harga_satuan)}</span>
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <div className="flex justify-between">
                                                        Rp <span>{formatRupiah(i.total)}</span>
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell className="pr-0">
                                                    {
                                                        canEdit ? (
                                                            <Checkbox
                                                                aria-label={`Select ${i.id}`}
                                                                slot="selection"
                                                                variant="secondary"
                                                            >
                                                                <Checkbox.Content>
                                                                    <Checkbox.Control>
                                                                    <Checkbox.Indicator />
                                                                    </Checkbox.Control>
                                                                </Checkbox.Content>
                                                            </Checkbox>
                                                        ) : (
                                                            <div className="flex items-center">
                                                                {
                                                                    selectedKeys.has(i.id) && <Check className="text-blue-500" />
                                                                }
                                                            </div>
                                                        )
                                                    }
                                                </Table.Cell>
                                                <Table.Cell>{i.catatan}</Table.Cell>
                                                <Table.Cell>
                                                    {
                                                        canEdit && (
                                                            <div className="flex gap-1">
                                                                <UpdateItemBastModal item={i} />
                                                                <CloseButton />
                                                            </div>
                                                        )
                                                    }
                                                </Table.Cell>
                                            </>
                                        )
                                    }
                                </Table.Row>
                                )
                            })
                        }
                        
                    </Table.Body>
                </Table.Content>
            </Table.ScrollContainer>
        </Table>

        {
            (canEdit && opr?.approvals[0].step === 2) && (
                <div className="flex gap-3">
                    <div className="flex-1 flex items-center gap-3">
                        <ApprovalButtons
                            noValidationSave
                            postOnly
                            isCanApprove={false}
                            isCanEdit={true}
                            form={{handleSubmit, getValues, isValid}}
                            saveFn={() => {} }
                            submitFn={(payload) => useOprasionalService.submit(opr?.id, payload)}
                            queryKey={['oprasional', opr?.id]}
                            postLabel='Request Approval BA'
                        />
                        <SubmitButton label="Simpan" isLoading={save_mutation.isPending} onPress={submitSave} />
                    </div>
                    {/* <DownloadBAST data={opr?.bast} /> */}
                </div>

            )
        }
        {
            opr?.approvals[0]?.step > 5 && (
                <UploadInput
                    pathUrl={`oprasional/bast/${opr?.bast}/upload_bast/`} 
                    value={bast?.dok} 
                    queryKey={['bast-detail', opr?.bast]}
                    queryKey2={['oprasional', opr?.id]}
                 />
            )
        }
    </Tabs.Panel>
  )
}

export default TabBast