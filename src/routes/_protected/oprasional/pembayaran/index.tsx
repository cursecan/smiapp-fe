import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useCashService } from '../../../../services/oprasional/cashService'
import { Breadcrumbs, Button, Card, Chip, Description, Table } from '@heroui/react'
import { FileDollar, House, TagDollar } from '@gravity-ui/icons'
import CreateModal from '../-components/pembayaran/CreateModal'
import { formatDate } from '../../../../utils/dateFormat'

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
                                <Table.Column>
                                    Penerima
                                </Table.Column>
                                {/* <Table.Column>
                                    Pemohon
                                </Table.Column> */}
                                <Table.Column>
                                    Nilai
                                </Table.Column>
                                <Table.Column>
                                    Status
                                </Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {
                                    data?.results.map(i => {
                                        return (
                                            <Table.Row key={i.id}>
                                                <Table.Cell>
                                                    <div className="">
                                                        <div className="flex gap-3">
                                                            <Button isIconOnly size='sm' variant='primary' className={'bg-orange-400'}>
                                                                <TagDollar />
                                                            </Button>
                                                            <div className="">
                                                                <div className="text-xs mb-2 underline text-gray-500">{formatDate(i.create_at)}</div>
                                                                <div className="">
                                                                    <Link to={`/oprasional/pembayaran/${i.id}`}>{i.keterangan}</Link>
                                                                </div>
                                                                <Description>N.SPK 12/PMS/UU/2006</Description>
                                                            </div> 
                                                        </div>
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <div className="">
                                                        PT. Surya Abadi
                                                        <div className="mb-2">
                                                            <Description>
                                                                Rek. 1982838 (BNI)
                                                                A.n Anderi Setiawan
                                                            </Description>
                                                        </div>
                                                        <Chip color='accent' variant='primary'>Pembayaran</Chip>
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    10.000
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Chip color='accent' variant='soft'>
                                                        Inisiasi
                                                    </Chip>
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    })
                                }
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>
            </Card.Content>
        </Card>

    </div>
  )
}
