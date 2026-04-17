import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useCashService } from '../../../../services/oprasional/cashService'
import { Breadcrumbs, Button, Card, Table } from '@heroui/react'
import { FileDollar, House, Plus } from '@gravity-ui/icons'
import CreateModal from '../-components/pembayaran/CreateModal'

export const Route = createFileRoute('/_protected/oprasional/pembayaran/')({
  component: RouteComponent,
})

function RouteComponent() {
    const {data, isLoading} = useQuery({
        queryKey: ['cashbon-list'],
        queryFn: async () => {
            return await useCashService.list()
        },
        select: (data) => data.data
    })

    if (isLoading) {
        return <div className="">Loading...</div>
    }


  return (
    <div className="">
        <Card>
            <FileDollar className='size-8' />
            <Card.Header>
                <Card.Title>
                    Pengajuan Pembayaran (Cashbon)
                </Card.Title>
                <Card.Description>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reiciendis, iusto.
                </Card.Description>
            </Card.Header>
            <Card.Footer>
                <Breadcrumbs>
                    <Breadcrumbs.Item>
                        <House />
                    </Breadcrumbs.Item>
                    <Breadcrumbs.Item>
                        Pengajuan Pembayaran
                    </Breadcrumbs.Item>
                </Breadcrumbs>
            </Card.Footer>
        </Card>
        
        <Card className='mt-6'>
            <Card.Header>
                <div className="flex">
                    <div className="flex-1"></div>
                    <div className="">
                        <CreateModal />
                    </div>
                </div>
            </Card.Header>
            <Card.Content>
                <Table>
                    <Table.ScrollContainer>
                        <Table.Content>
                            <Table.Header>
                                <Table.Column isRowHeader>
                                    Pengajuan
                                </Table.Column>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell>
                                        dada
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </Card.Content>
        </Card>

    </div>
  )
}
