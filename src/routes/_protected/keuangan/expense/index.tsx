import { createFileRoute, useNavigate } from '@tanstack/react-router'
import HeaderPage from '../../../../components/HeaderPage'
import { Button, Card, CloseButton, Description, Label, Table } from '@heroui/react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useExpOprasionalService } from '../../../../services/keuangan/op_expense'
import { formatRupiah } from '../../../../utils/formatCurrency'
import StatusChiper from '../../../../components/StatusChiper'
import { ArrowChevronRight } from '@gravity-ui/icons'

export const Route = createFileRoute('/_protected/keuangan/expense/')({
  component: RouteComponent,
})

function RouteComponent() {
    const {data, isLoading} = useQuery({
        queryKey: ['expense-opr-list'],
        queryFn: () => useExpOprasionalService.list(),
        select: (res) => res.data
    })

    const navigate = useNavigate()


    if (isLoading) {
        return <div className="">Loading...</div>
    }

    
  return (
    <div className="">
        <HeaderPage
            title='Expense'
        />
        <Card>
           <Card.Content>
            <Table>
                <Table.ScrollContainer>
                    <Table.Content>
                        <Table.Header>
                            <Table.Column isRowHeader>
                                Project
                            </Table.Column>
                            <Table.Column>
                                SPK
                            </Table.Column>
                            <Table.Column className={'w-0'}>
                                Nilai Penawaran
                            </Table.Column>
                             <Table.Column className={'w-0'}>
                                Total Casbon
                            </Table.Column>
                            <Table.Column className={'w-0'}>
                                Total Expense
                            </Table.Column>
                            <Table.Column className={'w-0'}>
                                Status
                            </Table.Column>
                            <Table.Column className={'w-0'}></Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {
                                data?.results.map(i => {
                                    return (
                                        <Table.Row key={i.id}>
                                            <Table.Cell>
                                                <div className="flex  flex-col">
                                                    <Description>{i.opr.penawaran?.nomor}</Description>
                                                    <Label>{i.opr.penawaran.nama_project}</Label>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {i.opr.penawaran.nomor_penugasan}
                                            </Table.Cell>
                                            <Table.Cell className={'truncate'}>{ formatRupiah(i.opr.nilai_penawaran) }</Table.Cell>
                                            <Table.Cell className={'truncate'}>{ formatRupiah(i.total_casbon) }</Table.Cell>
                                            <Table.Cell className={'truncate'}>{ formatRupiah(i.total_expense) }</Table.Cell>
                                            <Table.Cell>
                                                <StatusChiper status={''} />
                                            </Table.Cell>
                                            <Table.Cell>
                                                <div className="flex">
                                                    <Button onPress={() => navigate({to: `/keuangan/expense/${i.id}`})} isIconOnly>
                                                        <ArrowChevronRight />
                                                    </Button>
                                                </div>
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
