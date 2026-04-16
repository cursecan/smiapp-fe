import { Breadcrumbs, Button, Card, Chip, Table } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { usePenawaranService } from '../../../../services/penawaran.service'
import { useState } from 'react'
import ModalPenawaran from '../-components/penawaran/ModalPenawaran'
import { useFormatDate } from "../../../../utils/dateFormat"
import { Clock, House, LogoDocker, LogoMicrosoftOffice, OfficeBadge, Pulse } from '@gravity-ui/icons'


export const Route = createFileRoute('/_protected/komersial/penawaran/')({
  component: RouteComponent,
})

function RouteComponent() {
  const limit = 10
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState()
  const {data: penawaran, isLoading} = useQuery({
    queryKey: ['penawaran-list', page, search],
    queryFn: async({queryKey}) => usePenawaranService.getList({limit, page: queryKey[1] , q: queryKey[2]}),
    select: (data) => data.data
  })


  if (isLoading) {
    return <div className="">Loading</div>
  }
  

  return (
    <div className="">
      <Card>
        <Pulse className='size-8' />
        <Card.Header>
          <Card.Title>Penawaran</Card.Title>
          <Card.Description>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius, consequuntur!
          </Card.Description>
        </Card.Header>
        <Card.Footer>
          <Breadcrumbs>
            <Breadcrumbs.Item>
              <House />
            </Breadcrumbs.Item>
            <Breadcrumbs.Item>
              Penawaran Harga
            </Breadcrumbs.Item>
          </Breadcrumbs>
        </Card.Footer>
      </Card>

      <Card className='mt-6'>
        <Card.Header>
          <div className="flex items-center">
            <div className="flex-1"></div>
            <div className="">
              <ModalPenawaran />
            </div>
          </div>
        </Card.Header>
        <Card.Content>
          <Table>
            <Table.ScrollContainer>
              <Table.Content>
                <Table.Header>
                  <Table.Column isRowHeader>
                    Penawaran
                  </Table.Column>
                  {/* <Table.Column>
                    No. Surat Pesanan
                  </Table.Column> */}
                  <Table.Column>
                    Kapal
                  </Table.Column>
                  {/* <Table.Column>
                    Wilayah
                  </Table.Column>
                  <Table.Column>
                    Customer
                  </Table.Column> */}
                  <Table.Column>
                    Status
                  </Table.Column>
                  {/* <Table.Column>
                    Create At
                  </Table.Column> */}
                </Table.Header>
                <Table.Body>
                  {
                    penawaran?.results.map(i => {
                      return (
                        <Table.Row key={i.id}>
                          <Table.Cell>
                            <div className="flex gap-2">
                              <div className="">
                                <Button isIconOnly>
                                  <LogoDocker />
                                </Button>
                              </div>
                              <div className="">
                                <div className="text-xs mb-3 underline">{useFormatDate(i.create_at)}</div>
                                <Link to={`${i.id}`}>{i.nama_project}</Link>
                                <div className="">
                                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <LogoMicrosoftOffice />
                                    <div className="">{i.customer?.full_name}</div>
                                    <div className="">({i.customer?.company?.company_name || "-"})</div>
                                  </div>
                                  
                                  {/* <div className="flex flex-col">
                                    <div className="">{i.customer?.full_name}</div>
                                    <div className="">{i.customer?.company?.company_name || "-"}</div>
                                  </div> */}
                                </div>
                              </div>

                            </div>
                          </Table.Cell>
                          {/* <Table.Cell className={'truncate'}>{i.nomor_penugasan}</Table.Cell> */}
                          <Table.Cell className={'truncate'}>
                            <div className="flex flex-col gap-1">
                              { i.kapal.length > 0 && i.kapal.map(p => {
                                return <Chip key={p.id} color='danger' className='bg-orange-100'>{p.nama_kapal}</Chip>
                              })}
                            </div>
                          </Table.Cell>
                          {/* <Table.Cell>{i.lokasi?.lokasi || '-'}</Table.Cell>
                          <Table.Cell className={'truncate'}>
                            <div className="flex flex-col">
                              <div className="">{i.customer?.full_name}</div>
                              <div className="">{i.customer?.company?.company_name || "-"}</div>
                            </div>
                          </Table.Cell> */}
                          <Table.Cell>
                            <Chip variant='soft' color='accent'>
                              {
                                i.status[0].completed ? 'Selesai' : i.status[0].name 
                              }
                            </Chip>
                          </Table.Cell>
                          {/* <Table.Cell>
                            {useFormatDate(i.create_at)}
                          </Table.Cell> */}
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
