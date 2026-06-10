import { createFileRoute, useNavigate } from '@tanstack/react-router'
import HeaderPage from '../../../../components/HeaderPage'
import { Button, Card, Description, Label, Table, TableBody } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useCasbonService } from '../../../../services/oprasional/casbonService'
import { formatRupiah } from '../../../../utils/formatCurrency'
import StatusChiper from '../../../../components/StatusChiper'
import { ArrowChevronRight } from '@gravity-ui/icons'

export const Route = createFileRoute('/_protected/oprasional/casbon/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  const {data, isLoading} = useQuery({
    queryKey: ['casbon-list'],
    queryFn: async () => useCasbonService.list(),
    select: (res) => res.data
  })

  if (isLoading) {
    return <div className="">Loading...</div>
  }

  return (
    <div className="">
      <HeaderPage title='Casbon' />

      <Card className='mt-6'>
        <Card.Content>
          <Table>
            <Table.ScrollContainer>
              <Table.Content>
                <Table.Header>
                  <Table.Column isRowHeader>
                    Nomor
                  </Table.Column>
                  <Table.Column>Supplier</Table.Column>
                  <Table.Column className={'w-0'}>Nominal</Table.Column>
                  <Table.Column className={'w-0'}>Status</Table.Column>
                  <Table.Column className={'w-0'}></Table.Column>
                </Table.Header>
                <Table.Body>
                    {
                      data?.results.map(i => {
                        return (
                          <Table.Row>
                            <Table.Cell>
                              <Label>{ i.nomor }</Label>
                            </Table.Cell>
                            <Table.Cell>
                              <div className="flex flex-col">
                                <Label>{ i.supplier.full_name}</Label>
                                <Description>{i.supplier?.company?.company_name || '-'}</Description>
                              </div>
                            </Table.Cell>
                            <Table.Cell>
                              { formatRupiah(i.total)}
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