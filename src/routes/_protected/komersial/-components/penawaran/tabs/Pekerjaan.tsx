import { Tray } from '@gravity-ui/icons'
import { Description, EmptyState, Label, Surface, Table } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { usePenawaranService } from '../../../../../../services/penawaran.service'
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
    // console.log(items);
    

    const total_hpp = items.filter(i => !i.is_header).reduce((a,b) => (a+Number(b.harga_hpp * b.qty)), 0)
    const total_satuan = items.filter(i=> !i.is_header).reduce((a,b) => (a+Number(b.harga_satuan * b.qty)), 0)
    

  return (
    <Surface className='p-3 rounded-2xl'>
        <div className="flex justify-end mb-3">
            <ItemPenawaranModal disable={!canEdit} id={id} />
        </div>

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
    </Surface>

    
  )
}

export default Pekerjaan