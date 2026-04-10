
import { FontCursor, HandPointUp, Plus, Rocket } from '@gravity-ui/icons'
import ModalComponent from '../../../../../components/modals/ModalComponent'
import { Button, Description, SearchField, Surface, Tab, Table, useOverlayState } from '@heroui/react'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usePekerjaanService } from '../../../../../services/masterdata/pekerjaanService'
import { useItemPenawaranService } from '../../../../../services/penawaran.service'
import { formatRupiah } from '../../../../../utils/formatCurrency'

const ItemPenawaranModal = ({id, parent, simple=false}) => {
    const state = useOverlayState()
    const form = {
        penawaran: '',
        parent: '',
        code: '',
        barang_jasa: '',
        qty: 1,
        harga_satuan: 0,
        harga_hpp: 0,
        keterangan: '',
        is_header: false
    }

    const {data: pekerjaan} = useQuery({
        queryKey: ['pekerjaan-list-modal'],
        queryFn: async () => usePekerjaanService.list(),
        select: (data) => data.data
    })

    const qc = useQueryClient()
    const mutation = useMutation({
        mutationFn: async (payload) => useItemPenawaranService.create(payload),
        onSuccess: (res) => {
            qc.invalidateQueries({queryKey:['item-penawaran']})
        }
    })

    const handleCreateItem = (p) => {
        mutation.mutate({...form, penawaran: id, barang_jasa: p.nama_pekerjaan, harga_satuan: p.hpp, harga_hpp: p.hpp, parent: parent ? parent : ''})
    }


  return (
    <ModalComponent
        state={state}
        heading={'Data Sheet Pekerjaan'}
        size={'lg'}
        iconComponent={<Rocket className='size-6' />}
        buttonTrigger={<Button onPress={state.setOpen} isIconOnly={simple} size='sm'><Plus />{ !simple && <span>Tambah Item Penawaran</span> }</Button>}
        hideFooter

    >
        <Surface className='p-1 space-y-6'>
            <SearchField>
                <SearchField.Group>
                    <SearchField.SearchIcon />
                    <SearchField.Input placeholder='Cari nama pekerjaan'/>
                    <SearchField.ClearButton />
                </SearchField.Group>
            </SearchField>
            <Table>
                <Table.ScrollContainer>
                    <Table.Content>
                        <Table.Header>
                            <Table.Column isRowHeader>
                                Pekerjaan
                            </Table.Column>
                            <Table.Column>
                                Wilayah
                            </Table.Column>
                            <Table.Column>
                                Biaya Hpp
                            </Table.Column>
                            <Table.Column>

                            </Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {
                                pekerjaan?.results.map(i => {
                                    return (
                                        <Table.Row key={i.id}>
                                            <Table.Cell>
                                                {i.nama_pekerjaan}
                                            </Table.Cell>
                                            <Table.Cell>{i.wilayah?.lokasi}</Table.Cell>
                                            <Table.Cell>{formatRupiah(i.hpp)}</Table.Cell>
                                            <Table.Cell>
                                                <Button onPress={() => handleCreateItem(i)} size='sm'>Pilih <HandPointUp /></Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                })
                            }
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
        </Surface>
    </ModalComponent>
  )
}

export default ItemPenawaranModal