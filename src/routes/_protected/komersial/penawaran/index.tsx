import { Breadcrumbs, Button, Card, Chip, Description, Label, Surface, Table, Tag, TagGroup } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { usePenawaranService } from '../../../../services/penawaran.service'
import { useState } from 'react'
import ModalPenawaran from '../-components/penawaran/ModalPenawaran'
import { useFormatDate } from "../../../../utils/dateFormat"
import { Clock, House, Route as RouteIcon, LogoDocker, LogoMicrosoftOffice, OfficeBadge, Pulse, TagDollar, CloudNutHex, MapPin } from '@gravity-ui/icons'
import HeaderPage from '../../../../components/HeaderPage'
import { formatRupiah } from '../../../../utils/formatCurrency'


export const Route = createFileRoute('/_protected/komersial/penawaran/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [pageParam, setPageParam] = useState(1)
  const [search, setSearch] = useState()
  const {data: penawaran, isLoading} = useQuery({
    queryKey: ['penawaran-list', search],
    queryFn: async({queryKey}) => usePenawaranService.getList({pageParam, queryKey}),
    select: (data) => data.data
  })


  if (isLoading) {
    return <div className="">Loading</div>
  }
  

  return (
    <div className="mt-10">
      <HeaderPage
        title={'Penawaran Harga'}
      />
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
                    Kapal
                  </Table.Column>
                  <Table.Column>
                    Status
                  </Table.Column> */}
                  
                </Table.Header>
                <Table.Body>
                  {
                    penawaran?.results.map(i => {
                      return (
                        <Table.Row key={i.id}>
                          <Table.Cell>
                            {/* <div className="flex gap-2">
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
                                </div>
                              </div>

                            </div> */}

                            <div className="flex gap-2 items-center">
                              <Surface className='p-2 rounded-xl bg-amber-500'>
                                <RouteIcon />
                              </Surface>
                              <div className="flex flex-col gap-2 flex-1">
                                <Label>
                                  <Link to={`${i.id}`}>{i.nama_project}</Link>
                                </Label>
                               <div className="flex items-center justify-between">
                                <TagGroup variant='surface'>
                                  <TagGroup.List>
                                    <Tag>
                                      <TagDollar /> { formatRupiah(i.progress.budget || '0')}
                                    </Tag>
                                    <Tag>
                                      <LogoDocker /> { i.kapal ? i.kapal.length : '0' }
                                    </Tag>
                                     <Tag>
                                      <MapPin /> { i.lokasi?.lokasi || '-' }
                                    </Tag>
                                  </TagGroup.List>
                                </TagGroup>
                                <TagGroup>
                                  <TagGroup.List>
                                    <Tag>
                                      {i.status[0].completed ? 'Selesai' : i.status[0].name }
                                    </Tag>
                                  </TagGroup.List>
                                </TagGroup>
                               </div>
                              </div>
                            </div>
                          </Table.Cell>
                          {/* <Table.Cell className={'truncate'}>
                            <div className="flex flex-col gap-1">
                              { i.kapal.length > 0 && i.kapal.map(p => {
                                return <Chip key={p.id} color='danger' className='bg-orange-100'>{p.nama_kapal}</Chip>
                              })}
                            </div>
                          </Table.Cell>
                          
                          <Table.Cell>
                            <Chip variant='soft' color='accent'>
                              {
                                i.status[0].completed ? 'Selesai' : i.status[0].name 
                              }
                            </Chip>
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
