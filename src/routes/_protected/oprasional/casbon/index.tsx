import { createFileRoute, useNavigate } from '@tanstack/react-router'
import HeaderPage from '../../../../components/HeaderPage'
import { Button, Card, Description, EmptyState, Label, SearchField, Table, Tag, TagGroup } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useCasbonService } from '../../../../services/oprasional/casbonService'
import { formatRupiah } from '../../../../utils/formatCurrency'
import StatusChiper from '../../../../components/StatusChiper'
import { ArrowChevronRight,Tray } from '@gravity-ui/icons'

export const Route = createFileRoute('/_protected/oprasional/casbon/')({
  component: RouteComponent,
  validateSearch: (search) => ({
    page: Number(search?.page ?? 1),
    q: String(search?.q ?? '')
  })
})

function RouteComponent() {
  const navigate = useNavigate()
  const {page, q} = Route.useSearch()

  const {data} = useQuery({
    queryKey: ['casbon-list', page, q],
    queryFn: async ({queryKey}) => useCasbonService.list({queryKey}),
    select: (res) => res.data
  })

  const changeSearch =(e) => {
        setTimeout(() => {
        navigate({search: (prev) => ({...prev, q: e.target.value, page: 1})})
        }, 800);
    }


  return (
    <div className="">
      <HeaderPage title='Casbon' />

      <Card className='mt-6'>
        <Card.Header>
          <div className="flex items-center">
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
                    Nomor
                  </Table.Column>
                  <Table.Column>Supplier</Table.Column>
                  <Table.Column>Pemohon</Table.Column>
                  <Table.Column className={'w-0 truncate'}>Total Rupiah</Table.Column>
                  <Table.Column className={'w-0'}>Status</Table.Column>
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
                          <Table.Row>
                            <Table.Cell>
                              <div className="flex flex-col gap-1">
                                <Label>{ i.nomor }</Label>
                                <TagGroup>
                                  <TagGroup.List>
                                    {
                                      i.pembayaran && <Tag className={'bg-accent-soft text-accent'}>Pembayaran</Tag>
                                    }
                                    {
                                      i.petty_cash && <Tag className={'bg-warning-soft text-warning'}>Petty Cash</Tag>
                                    }
                                    {
                                      i.casbon && <Tag className={'bg-success-soft text-success'}>Casbon</Tag>
                                    }
                                  </TagGroup.List>
                                </TagGroup>

                              </div>
                            </Table.Cell>
                            <Table.Cell>
                              <div className="flex flex-col">
                                <Label>{ i.supplier?.full_name || 'Tidak Tersedia'}</Label>
                                <Description>{i.supplier?.company?.company_name || '-'}</Description>
                              </div>
                            </Table.Cell>
                            <Table.Cell>
                              <div className="flex flex-col">
                                <Label>{i.create_by.full_name}</Label>
                                <Description>{i.create_by.pegawai?.jabatan || '-'}</Description>
                              </div>
                            </Table.Cell>
                            <Table.Cell>
                              { formatRupiah(i.grand_total)}
                            </Table.Cell>
                            <Table.Cell  className={'truncate'}>
                              <StatusChiper status={i.status} />
                            </Table.Cell>
                            <Table.Cell>
                              <Button isIconOnly onPress={() => navigate({to: `/oprasional/casbon/${i.id}`})}>
                                <ArrowChevronRight />
                              </Button>
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