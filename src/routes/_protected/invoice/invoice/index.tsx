import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import HeaderPage from '../../../../components/HeaderPage'
import { Card, Description, EmptyState, LinkIcon, SearchField, Table } from '@heroui/react'
import { LinkSlash, Tray } from '@gravity-ui/icons'
import { useQuery } from '@tanstack/react-query'
import { useInvoiceService } from '../../../../services/invoice/invoiceService'
import { formatRupiah } from '../../../../utils/formatCurrency'
import { getApprovalStatus } from '../../../../components/useSchema'
import PaginationTable from '../../../../components/PaginationTable'
import StatusApprovalFilter from '../../../../components/StatusApprovalFilter'
import { Link as HeroLink } from '@heroui/react'
import StatusChiper from '../../../../components/StatusChiper'
import { formatDate } from '../../../../utils/dateFormat'

export const Route = createFileRoute('/_protected/invoice/invoice/')({
  component: RouteComponent,
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
    q: String(search.q ?? ''),
    status: String(search.status ?? '')
  })
})

function RouteComponent() {
    const navigate = useNavigate()
    const {page, q, status} = Route.useSearch()

    const {data} = useQuery({
        queryKey: ['invoices', page, q, status],
        queryFn: ({queryKey}) => useInvoiceService.list({queryKey}),
        select: (res) => res.data
    })

    const changeSearch = (e) => {
        setTimeout(() => {
          navigate({search: (prev) => ({...prev, q: e.target.value, page:1})})
        }, 800);
    }
    
    const totalPages = Math.ceil(data?.count/10)
    const approval_status = getApprovalStatus('Invoice Service')
    

    return (
        <div>
            <HeaderPage
                title={'Invoice Delivery'}
            />

            <Card className=''>
                <Card.Header>
                <div className="flex items-center">
                    <div className="flex-1 flex items-center gap-4">
                        <SearchField className={'w-100'}>
                            <SearchField.Group>
                                <SearchField.SearchIcon />
                                <SearchField.Input onChange={changeSearch} placeholder='Search...' className={'w-90'} />
                                <SearchField.ClearButton onPress={() => navigate({search: (prev) => ({...prev, q: undefined})})} />
                            </SearchField.Group>
                        </SearchField>
                        {/* <JenisPekerjaanFilter data={filter_pekerjaan} onChange={(e) => navigate({search: (prev) => ({...prev, pekerjaan: e})})} /> */}
                        <StatusApprovalFilter data={approval_status} onChange={(e) => navigate({search: (prev) => ({...prev, status: e})})} />
                    </div>

                </div>
                </Card.Header>
                <Card.Content>
                    <Table>
                        <Table.ScrollContainer>
                        <Table.Content>
                            <Table.Header>
                            <Table.Column isRowHeader>
                                Nomor
                            </Table.Column>
                            <Table.Column>
                                Customer
                            </Table.Column>
                            <Table.Column>
                                Request Date
                            </Table.Column>
                            <Table.Column>
                                Delivery Date
                            </Table.Column>
                            <Table.Column className={'truncate'}>
                                Amount
                            </Table.Column>
                            <Table.Column>Status</Table.Column>
                            <Table.Column></Table.Column>
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
                                            <Table.Row>
                                                <Table.Cell>
                                                    <Link to='$id' params={{id:  i.id}}>                                                    
                                                        <div className="link">
                                                            <p>{i.nomor_invoice}</p>
                                                            <LinkIcon className='link__icon' />
                                                        </div>
                                                    </Link>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <div className="">
                                                        <p>{i.customer.full_name}</p>
                                                        <Description>{i.customer.company?.company_name}</Description>
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell>{formatDate(i.create_at)}</Table.Cell>
                                                <Table.Cell>{i.delivery_date ? formatDate(i.delivery_date) : '-'}</Table.Cell>
                                                <Table.Cell>
                                                    { formatRupiah(i.nominal)}
                                                </Table.Cell>
                                                <Table.Cell className={'truncate'}>
                                                    <StatusChiper status={i.status} />
                                                </Table.Cell>
                                                <Table.Cell className={'truncate'}></Table.Cell>
                                            </Table.Row>
                                        )
                                    })
                                }
                            
                            </Table.Body>
                        </Table.Content>
                        </Table.ScrollContainer>
                        {
                            data?.count > 0 && (
                                <Table.Footer>
                                <PaginationTable totalPage={totalPages} page={page}  />
                                </Table.Footer>

                            )
                        }
                    </Table>
                </Card.Content>
            </Card>
        </div>
    )
}
