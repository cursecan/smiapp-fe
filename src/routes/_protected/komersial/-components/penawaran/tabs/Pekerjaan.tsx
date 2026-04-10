import { Plus, Tray } from '@gravity-ui/icons'
import { Button, EmptyState, Table } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useItemPenawaranService, usePenawaranService } from '../../../../../../services/penawaran.service'
import ItemPenawaranModal from '../../itemPenawaran/ItemPenawaranModal'
import ItemPenawaranPekerjaan from '../../itemPenawaran/ItemPenawaranPekerjaan'

const Pekerjaan = ({id}) => {
    const {data: items, isLoading} = useQuery({
        queryKey: ['item-penawaran'],
        queryFn: async () => await usePenawaranService.items(id),
        select: (data) => data.data
    })

    if (isLoading) {
        return null
    }
    console.log(items);
    
    

  return (
    <div className="space-y-3">
        <ItemPenawaranModal id={id} />

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
                                    <ItemPenawaranPekerjaan id={id} item={i} key={index} />
                                )
                            })
                        }
                    </Table.Body>

                </Table.Content>
            </Table.ScrollContainer>
        </Table>
    </div>
  )
}

export default Pekerjaan