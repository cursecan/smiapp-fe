import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import HeaderPage from '../../../../components/HeaderPage'
import { Avatar, Card, Checkbox, Chip, Description, EmptyState, Label, ProgressBar, SearchField, Table } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useOprasionalService } from '../../../../services/oprasional/oprasionalService'

import { formatRupiah } from '../../../../utils/formatCurrency'
import { fallbackName } from '../../../../utils/useFallbackName'
import PaginationTable from '../../../../components/PaginationTable'
import { Tray } from '@gravity-ui/icons'
import { usePegawayService } from '../../../../services/masterdata/pegawayService'
import { use, useEffect, useMemo } from 'react'
import SelectComponent from '../../../../components/input/SelectComponent'
import { useAuth } from '../../../../auth/AuthProvider'

export const Route = createFileRoute('/_protected/oprasional/oprasional/')({
  component: RouteComponent,
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
    q: String(search.q ?? ''),
    pic: String(search.pic ?? '')
  })
})

function RouteComponent() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const {page, q, pic} = Route.useSearch()
    
    const {data: resAgen} = useQuery({
        queryKey: ['agens-list'],
        queryFn: () => usePegawayService.agens(),
        select: (res) => res.data
    })
    
    const {data}= useQuery({
        queryKey: ['oprasional_list', page, q, pic],
        queryFn: ({queryKey}) => useOprasionalService.list({queryKey}),
        select: (data) => data.data,
        enabled: !!user
    })


    const transformAgen = useMemo(() => {
        const a = resAgen?.map(i => ({id: i.user.id, label: i.user.full_name})) ?? []
        return [{id: '', label: 'Semua Agen'}, ...a]
    })

    // if (isLoading) {
    //     return <div className="">Loading...</div>
    // }

    const changeSearch =(e) => {
        setTimeout(() => {
        navigate({search: (prev) => ({...prev, q: e.target.value, page: 1, pic: ''})})
        }, 800);
    }

    

    useEffect(() => {
        if (user) {
            navigate({search: (prev) => ({...prev, pic: user.id})})
        }
    }, [user])




    const totalPage = Math.ceil(data?.count / 10)

  return (
    <div className="">
        <HeaderPage
            title={'Operasional'}
        />


        <Card className='mt-6'>
            <Card.Header>
                <div className="flex items-center">
                    <div className="flex-1 flex gap-4 items-center">
                        <div className="w-64">
                            <SelectComponent placeholder={'Pilih User Agen'} value={pic} data={transformAgen} onChange={(e) => navigate({search: (prev) => ({...prev, page: 1, pic: e})})} />
                        </div>
                        <div className="flex-1 flex justify-end">
                            <SearchField className={'w-100'}>
                                <SearchField.Group>
                                    <SearchField.SearchIcon />
                                    <SearchField.Input onChange={changeSearch} placeholder='Search...' className={'w-90'} />
                                    <SearchField.ClearButton onPress={() => setSearch('')} />
                                </SearchField.Group>
                            </SearchField>

                        </div>
                        {/* <Checkbox isSelected={pic} onChange={(e) => navigate({search: (prev) => ({...prev, page: 1, only: e, q: ''})})}>
                            <Checkbox.Control>
                                <Checkbox.Indicator />
                            </Checkbox.Control>
                            <Checkbox.Content>
                                <Label>Hide Other</Label>
                            </Checkbox.Content>
                        </Checkbox> */}
                    </div>
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
                                <Table.Column className={'w-0'}>Nilai Penawaran</Table.Column>
                                <Table.Column className={'w-0'}>Status</Table.Column>
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
                                    data?.results?.map(i => {
                                        return (
                                            <Table.Row key={i.id}>
                                                <Table.Cell className={'truncate'}>
                                                    <div className="flex gap-2 items-center">
                                                        <Avatar>
                                                            <Avatar.Fallback className='bg-black text-white'>{fallbackName(i.assign_to?.full_name || 'NA')}</Avatar.Fallback>
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
                                                <Table.Cell className={'truncate'}>
                                                    <div className="flex flex-col">
                                                        <Label>{formatRupiah(i.nilai_penawaran)}</Label>
                                                        <Description className='truncate'>{formatRupiah(i.ppn)} (PPN)</Description>
                                                    </div>
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
                    {
                        data?.count > 0 && (
                            <Table.Footer>
                                <PaginationTable totalPage={totalPage} page={page} />
                            </Table.Footer>

                        )
                    }
                </Table>
            </Card.Content>
        </Card>
    </div>
  )
}
