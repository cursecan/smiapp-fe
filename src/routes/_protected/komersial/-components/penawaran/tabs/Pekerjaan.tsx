import { Plus, Tray } from '@gravity-ui/icons'
import { Button, Description, EmptyState, Input, Label, Table, TextField } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useItemPenawaranService, usePenawaranService } from '../../../../../../services/penawaran.service'
import ItemPenawaranModal from '../../itemPenawaran/ItemPenawaranModal'
import ItemPenawaranPekerjaan from '../../itemPenawaran/ItemPenawaranPekerjaan'
import { formatRupiah } from '../../../../../../utils/formatCurrency'

const Pekerjaan = ({id, canEdit}) => {
    const {data: items, isLoading} = useQuery({
        queryKey: ['item-penawaran'],
        queryFn: async () => await usePenawaranService.items(id),
        select: (data) => data.data
    })

    if (isLoading) {
        return <div className="">Loading...</div>
    }
    console.log(items);
    

    const total_hpp = items.reduce((a,b) => (!b.is_header ? a + Number(b.harga_hpp * b.qty) : 0), 0)
    const total_satuan = items.reduce((a,b) => (!b.is_header ? a + Number(b.harga_satuan * b.qty) : 0), 0)
    

  return (
    <div className="space-y-3">
        <ItemPenawaranModal disable={!canEdit} id={id} />

        <Table>
            <Table.ScrollContainer>
                <Table.Content>
                    <Table.Header>
                        <Table.Column isRowHeader>
                            Barang / Jasa
                        </Table.Column>
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
                            items?.map((i, index) => {
                                return (
                                    <ItemPenawaranPekerjaan  canEdit={canEdit} id={id} item={i} key={index} />
                                )
                            })
                        }
                    </Table.Body>
                </Table.Content>
            </Table.ScrollContainer>
            {
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
            }
        </Table>
    </div>
  )
}

export default Pekerjaan