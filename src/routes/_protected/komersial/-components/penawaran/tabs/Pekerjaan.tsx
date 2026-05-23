import { Tray } from '@gravity-ui/icons'
import {Button, EmptyState, Label, Radio, RadioGroup, Surface, Table, useOverlayState } from '@heroui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useItemPenawaranService, usePenawaranService } from '../../../../../../services/penawaran.service'
import ItemPenawaranPekerjaan from '../../itemPenawaran/ItemPenawaranPekerjaan'
import InputText from '../../../../../../components/input/InputText'
import ModalComponent from '../../../../../../components/modals/ModalComponent'
import { usePekerjaanService } from '../../../../../../services/masterdata/pekerjaanService'
import { useState } from 'react'
import CurrencyInput from '../../../../../../components/input/CurrencyInput'

const Pekerjaan = ({penawaran, canEdit}) => {
    const state = useOverlayState()
    const [form, setForm] = useState({
        penawaran: penawaran.id,
        reference_item: '',
        parent: '',
        code: '',
        barang_jasa: '',
        qty: 1,
        harga_satuan: '0',
        harga_hpp: 0,
        keterangan: '',
        is_header: false
    })

    const {data: items, isLoading} = useQuery({
        queryKey: ['item-penawaran'],
        queryFn: async () => await usePenawaranService.items(penawaran.id),
        select: (data) => data.data,
        enabled: !!penawaran.id
    })

    const {data: master_data, isLoading: masterLoading} = useQuery({
        queryKey: ['master-kerjaan-list-modal', '', penawaran.pelabuhan?.id],
        queryFn: async ({queryKey}) => usePekerjaanService.list({queryKey}),
        select: (data) => data.data,
        enabled: !!penawaran.pelabuhan?.id
    })

    const qc = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (payload) => useItemPenawaranService.create(payload),
        onSuccess: () => {
            qc.invalidateQueries({queryKey:['item-penawaran']})
            // setForm({...form, barang_jasa: '', harga_satuan: '0', qty: 1})
            state.close()
        }
    })

    const handleCreateItem = (e) => {
        mutation.mutate({...form, reference_item: e})
    }


    if (isLoading || masterLoading) {
        return <div className="">Loading...</div>
    }

    console.log(master_data, 'masterdata');
    

  return (
    <Surface className='p-3 rounded-2xl'>
        {
            canEdit && (

                <div className="flex mb-3 gap-3">
                    <div className="flex-1">
                        <InputText placeholder="Masukan nama barang atau jasa." label={'Nama Barang & Jasa'} value={form.barang_jasa} onChange={(e) => setForm({...form, barang_jasa: e.target.value})} />
                    </div>
                    <InputText label={'Qty'} value={form.qty} onChange={(e) => setForm({...form, qty: e.target.value})} />
                    <CurrencyInput label={'Harga'} value={form.harga_satuan} onChange={(e) => setForm({...form, harga_satuan: e})} />
                    <div className="flex flex-col justify-end">
                        <ModalComponent 
                            buttonTrigger={<Button isDisabled={!form.barang_jasa} variant='secondary' onPress={state.setOpen} size='sm'>Simpan</Button>}
                            state={state}
                            heading={'Pilih'}
                            hideFooter
                        >
                            <Surface className='mt-6'>
                                <RadioGroup onChange={handleCreateItem}>
                                    <Label>Reference Master Pekerjaan</Label>
                                    {
                                        master_data.results.map(m => {
                                            return (
                                                <Radio key={m.id} value={m.id}>
                                                    <Radio.Control>
                                                        <Radio.Indicator />
                                                    </Radio.Control>
                                                    <Radio.Content>
                                                        <Label>{m.nama_pekerjaan}</Label>
                                                    </Radio.Content>
                                                </Radio>
                                            )
                                        })
                                    }
                                </RadioGroup>
                            </Surface>
                        </ModalComponent>
                    </div>
                    {/* <ItemPenawaranModal items={items}  disable={!canEdit} id={penawaran.id} pelabuhan={penawaran.pelabuhan?.id} /> */}

                    {/* <PekerjaanComboBox /> */}
                </div>
            )
        }

        <Table>
            <Table.ScrollContainer>
                <Table.Content>
                    <Table.Header>
                        <Table.Column isRowHeader>
                            Barang / Jasa
                        </Table.Column>
                        <Table.Column>
                            Harga Satuan
                        </Table.Column>
                        <Table.Column>
                            Total
                        </Table.Column>
                        {
                            canEdit && (
                                <Table.Column>
                                    Aksi
                                </Table.Column>
                            )
                        }
                    </Table.Header>
                    <Table.Body
                        renderEmptyState={() => (
                            <EmptyState className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
                                <Tray />
                                <span className="text-sm text-muted">No results found</span>
                            </EmptyState>
                            )}
                    >
                        {
                            items?.filter((t) => !t.is_aggency_fee).map((i, index) => {
                                return (
                                    <ItemPenawaranPekerjaan pelabuhan={penawaran.pelabuhan?.id}  canEdit={canEdit} id={penawaran.id} item={i} key={index} />
                                )
                            })
                        }
                        {
                            items?.filter((t) => t.is_aggency_fee).map((i, index) => {
                                return (
                                    <ItemPenawaranPekerjaan  canEdit={canEdit} id={penawaran.id} item={i} key={index} />
                                )
                            })
                        }
                    </Table.Body>
                </Table.Content>
            </Table.ScrollContainer>
            {/* {
                items?.length > 0 && (
                    <Table.Footer className='justify-end gap-6'>
                        <div className="flex flex-col">
                            <Description>Total HPP</Description>
                            <Label>{formatRupiah(total_hpp)}</Label>
                        </div>
                        <div className="flex flex-col">
                            <Description>Total RAB</Description>
                            <Label>{formatRupiah(total_satuan)}</Label>
                        </div>
                    </Table.Footer>
                )
            } */}
        </Table>


        
    </Surface>
  )
}

export default Pekerjaan