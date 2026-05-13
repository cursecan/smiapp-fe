import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import HeaderPage from '../../../../components/HeaderPage'
import { Car, House, Rocket, RoundBrackets } from '@gravity-ui/icons'
import { Avatar, Breadcrumbs, Card, Chip, Description, Label, ProgressBar, SearchField, Table } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useOprasionalService } from '../../../../services/oprasional/oprasionalService'
import { useState } from 'react'
import { formatRupiah } from '../../../../utils/formatCurrency'
import { useFallbackName } from '../../../../utils/useFallbackName'

export const Route = createFileRoute('/_protected/oprasional/oprasional/')({
  component: RouteComponent,
})

function RouteComponent() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    const {data, isLoading}= useQuery({
        queryKey: ['oprasional_list', search],
        queryFn: async ({queryKey}) => {
            return await useOprasionalService.list({pageParam: page, queryKey})
        },
        select: (data) => data.data
    })


    if (isLoading) {
        return <div className="">Loading...</div>
    }

  return (
    <div className="mt-10">
        <HeaderPage
            title={'Operasional'}
        />


        <Card className='mt-6'>
            <Card.Header>
                <div className="flex items-center">
            <div className="flex-1">
              <SearchField className={'w-100'}>
                  <SearchField.Group>
                      <SearchField.SearchIcon />
                      <SearchField.Input onChange={() => {}} placeholder='Search...' className={'w-90'} />
                      <SearchField.ClearButton onPress={() => setSearch('')} />
                  </SearchField.Group>
              </SearchField>
            </div>
            {/* <div className="">
              <ModalPenawaran />
            </div> */}
          </div>
            </Card.Header>
            <Card.Content>
                <Table>
                    <Table.ScrollContainer>
                        <Table.Content>
                            <Table.Header>
                                <Table.Column isRowHeader className={'w-50 truncate'}>Agen</Table.Column>
                                <Table.Column>Penawaran</Table.Column>
                                <Table.Column>Progress</Table.Column>
                                <Table.Column className={'truncate w-0'}>Budget</Table.Column>
                                <Table.Column className={'truncate w-0'}>Status</Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {
                                    data?.results?.map(i => {
                                        return (
                                            <Table.Row key={i.id}>
                                                <Table.Cell className={'truncate'}>
                                                    <div className="flex gap-2 items-center">
                                                        <Avatar>
                                                            <Avatar.Fallback className='bg-black text-white'>{useFallbackName(i.assign_to?.full_name || 'NA')}</Avatar.Fallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div className="">{i.assign_to?.full_name || 'Unmaped'}</div>
                                                            <Description>{i.assign_to?.pegawai?.cabang || '-'}</Description>
                                                        </div>
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Description>{i.penawaran.nomor} / <span className=''>{i.penawaran.nomor_penugasan}</span></Description>
                                                    <div className="">
                                                        <Link to={`${i.id}`}>{i.penawaran.nama_project}</Link>
                                                    </div>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <ProgressBar size='sm' color='danger' value={i.penawaran.progress?.progress||0}>
                                                        <ProgressBar.Output />
                                                        <ProgressBar.Track>
                                                            <ProgressBar.Fill />
                                                        </ProgressBar.Track>
                                                    </ProgressBar>
                                                </Table.Cell>
                                                <Table.Cell className={'truncate w-0'}>
                                                    {
                                                        formatRupiah(i.penawaran.progress?.budget || 0)
                                                    }
                                                </Table.Cell>
                                                <Table.Cell className={'truncate'}>
                                                    <Chip>{i.status[0]?.name}</Chip>
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
