import { Label, Surface, Table } from "@heroui/react"
import PekerjaaItemRow from "./PekerjaaItemRow"
import { useQuery } from "@tanstack/react-query"
import { usePenawaranService } from "../../../../../../services/penawaran.service"

const Pekerjaanv2 = ({penawaran}) => {

    const {data: items, isLoading} = useQuery({
        queryKey: ['item-penawaran'],
        queryFn: async () => await usePenawaranService.items(penawaran.id),
        select: (data) => data.data,
        enabled: !!penawaran.id
    })

    if (isLoading) {
        return <div className="">Loading...</div>
    }
    
  return (
    <Surface className="rounded-xl p-3">
        <Label className="text-lg">Rincian Pekerjaan</Label>
        <Table>
            <Table.ScrollContainer>
                <Table.Content>
                    <Table.Header>
                        <Table.Column isRowHeader>
                            Pekerjaan
                        </Table.Column>
                        <Table.Column className={'w-20'}>
                            Qty
                        </Table.Column>
                        <Table.Column className={'w-32'}>Harga</Table.Column>
                        <Table.Column className={'w-32'}>Total</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {
                            items.map((item, index_item) => {
                                return (
                                    <PekerjaaItemRow item={item} key={index_item} />
                                )
                            })
                        }
                        <PekerjaaItemRow />
                    </Table.Body>
                </Table.Content>
            </Table.ScrollContainer>
        </Table>
    </Surface>
  )
}

export default Pekerjaanv2