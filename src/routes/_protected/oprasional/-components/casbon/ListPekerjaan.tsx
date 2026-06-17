import { Button, Card, Checkbox, Label, Table } from "@heroui/react"
import InputText from "../../../../../components/input/InputText"
import CurrencyInput from "../../../../../components/input/CurrencyInput"
import SatuanSelect from "../../../../../components/input/SatuanSelect"
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useItemCasbonService } from "../../../../../services/oprasional/casbonItemService"
import { useToast } from "../../../../../lib/useToast"
import { useCasbonService } from "../../../../../services/oprasional/casbonService"
import CasbonListItem from "./CasbonListItem"
import { formatRupiah } from "../../../../../utils/formatCurrency"
import CheckboxInput from "../../../../../components/input/CheckboxInput"

const ListPekerjaan = ({casbon, canEdit=false}) => {
    const [isContent, setISContent] = useState(true)
    const [openCreate, setOpenCreate] = useState(false)
    const [form, setForm] = useState({
        pekerjaan: '',
        qty: 1,
        satuan: '',
        is_ppn: false,
        harga: 0,
        keterangan: '',
    })


    const {data: casbon_items, isLoading} = useQuery({
        queryKey: ['casbon-item-list', casbon.id],
        queryFn: () => useCasbonService.items(casbon.id),
        enabled: !!casbon.id,
        select: (res) => res.data
    })


    const qc = useQueryClient()
    const toast = useToast()

    const initData = () => {
        setForm({
            pekerjaan: '',
            qty: 1,
            satuan: '',
            is_ppn: false,
            harga: 0,
            keterangan: '',
        })
    }

    const save = useMutation({
        mutationFn: (payload) => useItemCasbonService.create(payload),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['casbon-item-list']})
            toast.success({message: 'Success', description:'Berhasil disimpan.'})
            initData()
        }
    })


    const handeSave = () => {
        save.mutate({...form, casbon: casbon.id})
    }

    
    if (isLoading) {
        return null
    }
    
    const total_bef_ppn = casbon_items?.reduce((a, b) => a + Number(b.harga) * b.qty, 0)
    const total_ppn = !casbon.is_ppn ? 0 : Math.ceil(casbon_items.reduce((a, b) => a + Number(b.harga) * b.qty * (b.is_ppn ? 0.11 : 0), 0))
    const total_pph = Math.ceil(total_bef_ppn * casbon.pph_rate)
    const total_after_ppn = total_bef_ppn + total_ppn - total_pph
    


  return (
    <Card variant='secondary'>
        <Card.Content>
            {
                canEdit && (
                    <>
                        {
                            openCreate ? (
                                <div className="flex gap-2 flex-col mt-4 mb-5">
                                    <Checkbox isDisabled id="is-content-selected" isSelected={isContent} onChange={setISContent}>
                                        <Checkbox.Control>
                                            <Checkbox.Indicator />
                                        </Checkbox.Control>
                                        <Checkbox.Content>
                                            <Label>Content</Label>
                                        </Checkbox.Content>
                                    </Checkbox>
                                    <InputText value={form.pekerjaan} onChange={(e) => setForm({...form, pekerjaan: e.target.value})} label="Pekerjaan" />
                                    <div className="flex gap-4 items-end">
                                        {
                                            isContent && (
                                                <>
                                                    <div className="w-16">
                                                        <CurrencyInput label={'Volume'} value={form.qty} onChange={(e) => setForm({...form, qty: e})} />
                                                    </div>
                                                    <SatuanSelect label={'Satuan'} value={form.satuan} onChange={(e) => setForm({...form, satuan: e})} />
                                                    <CurrencyInput label={'Harga'} value={form.harga} onChange={(e) => setForm({...form, harga: e})} />
                                                    <CheckboxInput label={'Is PPn'} value={form.is_ppn} onChange={(e) => setForm({...form, is_ppn: e})} />
                                                </>
                                            )
                                        }
                                        <div className="flex-1 flex justify-end gap-2">
                                            <Button variant="danger-soft" onPress={() => setOpenCreate(false)}>Cancel</Button>
                                            <Button onPress={handeSave}>Add</Button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-end">
                                    <Button onPress={() => setOpenCreate(true)} variant="secondary">Create Item Casbon</Button>
                                </div>
                            )
                        }
                    </>

                )
            }
            <Table className="font-mono">
                <Table.ScrollContainer>
                    <Table.Content>
                        <Table.Header>
                            <Table.Column isRowHeader>
                                Pekerjaan
                            </Table.Column>
                            <Table.Column className={'w-10'}>Vol</Table.Column>
                            <Table.Column className={'w-24'}>Satuan</Table.Column>
                            <Table.Column className={'w-24'}>Harga</Table.Column>
                            <Table.Column className={'w-24'}>Total</Table.Column>
                            <Table.Column className={'w-0'}>PPn</Table.Column>
                            <Table.Column className={'w-0'}></Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {
                                casbon_items.map((i, index) => {
                                    return (
                                        <CasbonListItem canEdit={canEdit} key={index} item={i} />
                                    )
                                })
                            }

                            {
                                casbon_items.length > 0 && (
                                    <>
                                        <Table.Row>
                                            <Table.Cell colSpan={4} className={'text-center'}><strong>Total Sebelum PPn</strong></Table.Cell>
                                            <Table.Cell>{formatRupiah(total_bef_ppn)}</Table.Cell>
                                            <Table.Cell colSpan={2}></Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell colSpan={4} className={'text-center'}><strong>PPn 11%</strong></Table.Cell>
                                            <Table.Cell>{formatRupiah(total_ppn)}</Table.Cell>
                                            <Table.Cell colSpan={2}></Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell colSpan={4} className={'text-center'}><strong>Pot. PPh {casbon.pph_rate * 100}%</strong></Table.Cell>
                                            <Table.Cell>({formatRupiah(total_pph)})</Table.Cell>
                                            <Table.Cell colSpan={2}></Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell colSpan={4} className={'text-center'}><strong>Total Setelah PPn</strong></Table.Cell>
                                            <Table.Cell>{formatRupiah(total_after_ppn)}</Table.Cell>
                                            <Table.Cell colSpan={2}></Table.Cell>
                                        </Table.Row>
                                    </>
                                    
                                )
                            }
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
            
        </Card.Content>
    </Card>
  )
}

export default ListPekerjaan