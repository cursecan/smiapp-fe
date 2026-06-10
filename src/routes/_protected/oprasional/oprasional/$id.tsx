import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useOprasionalService } from '../../../../services/oprasional/oprasionalService'
import HeaderPage from '../../../../components/HeaderPage'
import { Breadcrumbs, Button, Card, CloseButton, Description, Label, Surface, Table, Tabs } from '@heroui/react'
import KegiatanList from '../-components/oprasional/KegiatanList'
import { formatRupiah } from '../../../../utils/formatCurrency'
import { ArrowChevronRight, Plus } from '@gravity-ui/icons'
import { formatSimpleDate } from '../../../../utils/dateFormat'
import StatusChiper from '../../../../components/StatusChiper'

export const Route = createFileRoute('/_protected/oprasional/oprasional/$id')({
  component: RouteComponent,
})

function RouteComponent() {
    const { id } = useParams({from: '/_protected/oprasional/oprasional/$id'})
    const navigate = useNavigate()

    const { data, isLoading } = useQuery({
        queryKey: ['oprasional', id],
        queryFn: async () => {
            return await useOprasionalService.detail(id)
        },
        select: (data) => data.data
    })

    const {data: casbon, isLoading: casbonLoading} = useQuery({
        queryKey: ['casbon-item-list-ref'],
        queryFn: () => useOprasionalService.casbon(id),
        select: (res) => res.data,
        enabled: !!id
    })

    const total_casbon = casbon?.reduce((a, b) => a + b.total.hpp, 0)
    const total_budget = data?.penawaran.progress.budget
    const profit = total_budget - total_casbon


    if (isLoading || casbonLoading) {
        return <div className="">Loading</div>
    }

  return (
    <div className="">
        <HeaderPage
            title={`Detail Oprasional`}
            breadchrumb={<Breadcrumbs>
                <Breadcrumbs.Item onPress={() => navigate({to: '/oprasional/oprasional'})}>
                    Oprasional
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                    Detail
                </Breadcrumbs.Item>
            </Breadcrumbs>}
        />

        <div className="mt-6 flex gap-10">
            <Card className='w-100'>
                <Card.Header>
                    <Card.Title>{data?.penawaran.nomor}</Card.Title>
                </Card.Header>
                <Card.Content>
                    <Surface variant='secondary' className='p-3 rounded-2xl  space-y-6'>
                        <div className="flex flex-1 flex-col space-y-2">
                            <Description>Nama Project</Description>
                            <Label>{data?.penawaran.nama_project}</Label>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex flex-col space-y-2">
                                <Description>Nomor PO/SPK</Description>
                                <Label>{data?.penawaran.nomor_penugasan}</Label>
                            </div>
                            
                            <div className="flex flex-col space-y-2">
                                <Description>Tanggal Surat</Description>
                                <Label>{data?.penawaran.tgl_surat}</Label>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Description>Wilayah / Pelabuhan</Description>
                            <Label>{data?.penawaran.pelabuhan.nama_pelabuhan}</Label>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Description>PIC Penganggungjawab</Description>
                            {
                               data?.assign_to?.full_name ? (
                                    <Label>{data?.assign_to?.full_name} { data?.assign_to?.pegawai?.cabang && <span>{data?.assign_to?.pegawai?.cabang}</span>}</Label>
                                ) : (
                                    <div className="flex items-center justify-between">N/A</div>
                                )
                            }
                        </div>
                        <div className="flex flex-col space-y-2">
                            <Description>Jenis Pekerjaan</Description>
                            <Label>{data?.penawaran.jenis_pekerjaan.jenis_pekerjaan}</Label>
                        </div>
                        {/* <div className="flex flex-col space-y-2">
                            <Description>Budget RAB</Description>
                            <Label>{formatRupiah(data?.penawaran.progress.budget)}</Label>
                        </div> */}
                        <Surface className='p-3 rounded-2xl'>
                            <Table>
                                <Table.ScrollContainer>
                                    <Table.Content>
                                        <Table.Header >
                                            <Table.Column isRowHeader>
                                                Kapal
                                            </Table.Column>
                                        </Table.Header>
                                        <Table.Body>
                                            {
                                                data?.penawaran.kapal.map(i => {
                                                    return (
                                                        <Table.Row key={i.id}>
                                                            <Table.Cell>{i.nama_kapal}</Table.Cell>
                                                        </Table.Row>
                                                    )
                                                })
                                            }
                                        </Table.Body>
                                    </Table.Content>
                                </Table.ScrollContainer>
                            </Table>
                        </Surface>
                    </Surface>
                </Card.Content>
            </Card>
            <div className="flex-1">
                <Card>
                    <Card.Header>
                        <Card.Title>Operasional Activity</Card.Title>
                        <Description>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nulla, harum?</Description>
                    </Card.Header>
                    <Card.Content>
                        <Tabs>
                            <Tabs.ListContainer>
                                <Tabs.List className='w-fit *:data-[selected=true]:text-accent-foreground'>
                                    <Tabs.Tab id={'pekerjaan'}>
                                        <span>Progress</span>
                                        <Tabs.Indicator className='bg-accent' />
                                    </Tabs.Tab>
                                    <Tabs.Tab id={'casbon'}>
                                        Casbon
                                        <Tabs.Indicator className='bg-accent' />
                                    </Tabs.Tab>
                                </Tabs.List>
                            </Tabs.ListContainer>
                            <Tabs.Panel id={'pekerjaan'}>
                                <KegiatanList data={data} />
                            </Tabs.Panel>
                            <Tabs.Panel id={'casbon'}>
                                <div className="">
                                    <div className="flex justify-end mb-5">
                                        <Button onPress={() => navigate({to: `/oprasional/casbon/create?ref=${data.id}`})} variant='primary' className={'bg-success'}><Plus /> Casbon</Button>
                                    </div>
                                    <Table>
                                        <Table.ScrollContainer>
                                            <Table.Content>
                                                <Table.Header>
                                                    <Table.Column isRowHeader>Nomor</Table.Column>
                                                    <Table.Column>Tanggal Dibuat</Table.Column>
                                                    <Table.Column>Amount</Table.Column>
                                                    <Table.Column>
                                                        Status
                                                    </Table.Column>
                                                    <Table.Column className={'w-0'}>
                                                    </Table.Column>
                                                </Table.Header>
                                                <Table.Body>
                                                    {
                                                        casbon.map((i, index) => {
                                                            return (
                                                                <Table.Row key={index}>
                                                                    <Table.Cell>
                                                                        <div className="flex flex-col">
                                                                            <Label>Ke-{index+1}</Label>
                                                                            <Description>{i.nomor}</Description>
                                                                        </div>
                                                                    </Table.Cell>
                                                                    <Table.Cell>{formatSimpleDate(i.create_at)}</Table.Cell>
                                                                    <Table.Cell className={'w-40'}>{formatRupiah(i.total.hpp)}</Table.Cell>
                                                                    <Table.Cell className={'w-0 truncate'}>
                                                                        <StatusChiper status={i.status} />
                                                                    </Table.Cell>
                                                                    <Table.Cell>
                                                                        <CloseButton onPress={() => navigate({to: `/oprasional/casbon/${i.id}`})} className={'bg-accent text-accent-foreground'}>
                                                                            <ArrowChevronRight />
                                                                        </CloseButton>
                                                                    </Table.Cell>
                                                                </Table.Row>
                                                            )
                                                        })
                                                    }

                                                    <Table.Row>
                                                        <Table.Cell colSpan={2} className={'text-right'}>
                                                            Casbon
                                                        </Table.Cell>
                                                        <Table.Cell colSpan={3}>
                                                            {formatRupiah(total_casbon)}
                                                        </Table.Cell>
                                                    </Table.Row>
                                                    <Table.Row>
                                                        <Table.Cell colSpan={2} className={'text-right'}>
                                                            Budget RAB
                                                        </Table.Cell>
                                                        <Table.Cell colSpan={3}>
                                                            <div className="flex gap-5 items-center">
                                                                <span>
                                                                    {formatRupiah(total_budget)} 
                                                                </span>
                                                                {
                                                                    profit > 0 ? <span className='text-success'>{formatRupiah(profit)}</span> : <span className='text-danger'>({formatRupiah(profit)})</span>
                                                                }

                                                            </div>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                </Table.Body>
                                            </Table.Content>
                                        </Table.ScrollContainer>
                                    </Table>
                                </div>
                            </Tabs.Panel>
                        </Tabs>
                    </Card.Content>
                </Card>
                {/* <div className="mt-4">
                    <Button isDisabled>Submit Approval</Button>
                </div> */}
            </div>
        </div>
    </div>
  )
}