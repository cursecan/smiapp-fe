import { Button, Checkbox, CloseButton, Label, Surface, Table, Tabs, TextArea } from "@heroui/react"
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

const TabBast = ({opr, canEdit=false}) => {
    const [form, setForm] = useState()
    const [selectedKeys, setSelectedKeys] = useState();
    const toast = useToast()

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
    


  return (
    <Tabs.Panel id={'ba'} className='space-y-4'>
        <Surface className="p-3 rounded-2xl space-y-3" variant='secondary'>
            <TextArea fullWidth isReadOnly={!canEdit} value={form?.pekerjaan} onChange={(e) => setForm({...form, pekerjaan: e.target.value})} />
            <div className="flex gap-3">
                <DateInput isReadOnly={!canEdit} label={'Mulai'} value={form?.tgl_mulai} onChange={(e) => setForm({...form, tgl_mulai: e})} />
                <DateInput isReadOnly={!canEdit} label={'Selesai'} value={form?.tgl_selesai} onChange={(e) => setForm({...form, tgl_selesai: e})} />
            </div>
            <SimpleComboBox
                label={'Customer / Pemohon Pekerjaan'}
                fetchUrl={({pageParam, queryKey}) => useCustomerService.list({pageParam, queryKey})}
                filter={(i) => ({...i, name: i.full_name, description: i.company?.company_name ?? ''})}
                fetchDetailUrl={({queryKey}) => useCustomerService.detail(queryKey.at(1))}
                query={['customer-combox']}
                value={form?.customer}
                onChange={(e) => setForm({...form, customer: e})}
                // isDisabled={!canEdit}
            />
            <div className="flex gap-4">

                <SimpleComboBox
                    label={'Direktur'}
                    fetchUrl={({pageParam, queryKey}) => usePegawayService.list({pageParam, queryKey})}
                    filter={(i) => ({...i, name: i.user.full_name, description: i.jabatan.nama_jabatan ?? ''})}
                    fetchDetailUrl={({queryKey}) => usePegawayService.detai(queryKey.at(1))}
                    query={['direksi-combox']}
                    value={form?.direksi}
                    onChange={(e) => setForm({...form, direksi: e})}
                    // isDisabled={!canEdit}
                />
                <SimpleComboBox
                    label={'Direktur'}
                    fetchUrl={({pageParam, queryKey}) => usePegawayService.list({pageParam, queryKey})}
                    filter={(i) => ({...i, name: i.user.full_name, description: i.jabatan.nama_jabatan ?? ''})}
                    fetchDetailUrl={({queryKey}) => usePegawayService.detai(queryKey.at(1))}
                    query={['direksi-combox2']}
                    value={form?.direksi_2}
                    onChange={(e) => setForm({...form, direksi_2: e})}
                    // isDisabled={!canEdit}
                />
            </div>
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
                                    <Table.Cell>{i.rincian_pekerjaan}</Table.Cell>
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
                                    </Table.Cell>
                                    <Table.Cell>{i.catatan}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex gap-1">
                                           <UpdateItemBastModal item={i} />
                                            <CloseButton />
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                                )
                            })
                        }
                        
                    </Table.Body>
                </Table.Content>
            </Table.ScrollContainer>
        </Table>
        <div className="flex justify-between">
            <Button onPress={submitSave}>Simpan Update</Button>
            <DownloadBAST data={opr?.bast} />
        </div>
    </Tabs.Panel>
  )
}

export default TabBast