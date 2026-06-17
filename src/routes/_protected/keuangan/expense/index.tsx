import { createFileRoute, useNavigate } from '@tanstack/react-router'
import HeaderPage from '../../../../components/HeaderPage'
import { Button, Card, Description, EmptyState, Label, SearchField, Table } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useExpOprasionalService } from '../../../../services/keuangan/op_expense'
import { formatRupiah } from '../../../../utils/formatCurrency'
import StatusChiper from '../../../../components/StatusChiper'
import { ArrowChevronRight, Tray } from '@gravity-ui/icons'

export const Route = createFileRoute('/_protected/keuangan/expense/')({
  component: RouteComponent,
  validateSearch: (search) => ({
    page: Number(search?.page ?? 1),
    q: String(search?.q ?? '')
  })
})

function RouteComponent() {
    const { page, q } = Route.useSearch()
    const navigate = useNavigate()

    const {data} = useQuery({
        queryKey: ['expense-opr-list', page, q],
        queryFn: ({queryKey}) => useExpOprasionalService.list({queryKey}),
        select: (res) => res.data
    })
    

    const changeSearch =(e) => {
        setTimeout(() => {
        navigate({search: (prev) => ({...prev, q: e.target.value, page:1})})
        }, 800);
    }


    
  return (
    <div className="">
        <HeaderPage
            title='Expense'
        />
        <Card>
            <Card.Header>
                <div className="flex">
                    <SearchField className={'w-100'}>
                        <SearchField.Group>
                            <SearchField.SearchIcon />
                            <SearchField.Input onChange={changeSearch} placeholder='Search...' className={'w-90'} />
                            <SearchField.ClearButton onPress={() => navigate({search: (prev) => ({...prev, q: undefined})})} />
                        </SearchField.Group>
                    </SearchField>
                </div>
            </Card.Header>
           <Card.Content>
            <Table>
                <Table.ScrollContainer>
                    <Table.Content>
                        <Table.Header>
                            <Table.Column isRowHeader>
                                Project
                            </Table.Column>
                            <Table.Column className={'w-0 truncate'}>
                                Nilai Penawaran
                            </Table.Column>
                             <Table.Column className={'w-0 truncate'}>
                                Total Casbon
                            </Table.Column>
                            <Table.Column className={'w-0 truncate'}>
                                Total Expense
                            </Table.Column>
                            <Table.Column className={'w-0'}>
                                Status
                            </Table.Column>
                            <Table.Column className={'w-0'}></Table.Column>
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
                                data?.results.map(i => {
                                    return (
                                        <Table.Row key={i.id}>
                                            <Table.Cell>
                                                <div className="flex  flex-col">
                                                    <Description>{i.opr.penawaran?.nomor}</Description>
                                                    <Label>{i.opr.penawaran.nama_project}</Label>
                                                    <Description>
                                                        {i.opr.penawaran.nomor_penugasan}
                                                    </Description>
                                                </div>
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
