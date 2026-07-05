import { Card, Description, Surface, Table } from "@heroui/react"
import CreateTagihanModal from "./CreateTagihanModal"
import { useParams } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { useCasbonService } from "../../../../../services/oprasional/casbonService"
import ItemTagihan from "./ItemTagihan"

const ListTagihan = ({canEdit=false}) => {
    const { id } = useParams({from: '/_protected/oprasional/casbon/$id'})
    const {data} = useQuery({
        queryKey: ['tagihan-list'],
        queryFn: () => useCasbonService.items(id),
        select: (res) => res.data
    })


    
    
  return (
    <Card variant="secondary">
        <Card.Header>
            <div className="flex justify-end">
                <CreateTagihanModal canEdit={canEdit} casbonId={id} />
            </div>
            <div className="text-right">
                <Description>Lorem ipsum dolor sit amet consectetur adipisicing elit. At, saepe.</Description>
            </div>
        </Card.Header>
        <Card.Content className="flex flex-col space-y-3">
            <Surface className="rounded-2xl p-3">
                <Table>
                    <Table.ScrollContainer>
                        <Table.Content>
                            <Table.Header>
                                <Table.Column isRowHeader>
                                    Invoice / Tagihan
                                </Table.Column>
                                <Table.Column>Tanggal Invoice</Table.Column>
                                <Table.Column>Nominal</Table.Column>
                                <Table.Column className={'truncate w-0'}></Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {
                                    data?.map(i => {
                                        return (
                                            <ItemTagihan canEdit={canEdit} key={i.id} item={i} />
                                        )
                                    })
                                }
                                <Table.Row>
                                    <Table.Cell colSpan={2} className={'text-right italic'}>Potongan PPh</Table.Cell>
                                    <Table.Cell colSpan={2} className={'italic'}>(0)</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell colSpan={2} className={'text-right font-semibold italic'}>Total</Table.Cell>
                                    <Table.Cell colSpan={2} className={'font-semibold italic'}>0</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>

            </Surface>
        </Card.Content>
    </Card>
  )
}

export default ListTagihan