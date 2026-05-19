import { Card, Description, Label, SearchField, Surface, Table, Tag, TagGroup } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { usePenawaranService } from '../../../../services/penawaran.service'
import ModalPenawaran from '../-components/penawaran/ModalPenawaran'
import { Route as RouteIcon, LogoDocker, TagDollar, MapPin } from '@gravity-ui/icons'
import HeaderPage from '../../../../components/HeaderPage'
import { formatRupiah } from '../../../../utils/formatCurrency'
import PaginationTable from '../../../../components/PaginationTable'


export const Route = createFileRoute('/_protected/komersial/penawaran/')({
  component: RouteComponent,
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
    q: String(search.q ?? '')
  })
})

function RouteComponent() {
  const navigate = useNavigate()
  const {page, q} = Route.useSearch()
  const {data: penawaran} = useQuery({
    queryKey: ['penawaran-list', page, q],
    queryFn: async ({queryKey}) => usePenawaranService.getList({queryKey}),
    select: (data) => data.data
  })

  const changeSearch =(e) => {
    setTimeout(() => {
      navigate({search: (prev) => ({...prev, q: e.target.value})})
    }, 800);
  }

  const totalPages = Math.ceil(penawaran?.count/10)


  // if (isLoading) {
  //   return <div className="">Loading</div>
  // }
  

  return (
    <div className="mt-10">
      <HeaderPage
        title={'Penawaran Harga'}
      />
      <Card className='mt-6'>
        <Card.Header>
          <div className="flex items-center">
            <div className="flex-1">
              <SearchField className={'w-100'}>
                  <SearchField.Group>
                      <SearchField.SearchIcon />
                      <SearchField.Input onChange={changeSearch} placeholder='Search...' className={'w-90'} />
                      <SearchField.ClearButton onPress={() => navigate({search: (prev) => ({...prev, q: undefined})})} />
                  </SearchField.Group>
              </SearchField>
            </div>
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
                </Table.Header>
                <Table.Body>
                  {
                    penawaran?.results.map(i => {
                      return (
                        <Table.Row key={i.id}>
                          <Table.Cell>
                            <div className="flex gap-2 items-center">
                              <Surface className='p-2 rounded-xl bg-amber-500'>
                                <RouteIcon />
                              </Surface>
                              <div className="flex flex-col gap-2 flex-1">
                                <Description>{i.nomor}</Description>
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
                                      <MapPin /> { i.pelabuhan?.nama_pelabuhan || '-' }
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
                        </Table.Row>
                      )
                    })
                  }
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
            {
              penawaran?.count > 0 && (
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
