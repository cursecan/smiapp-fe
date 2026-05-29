import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useOprasionalService } from '../../../../services/oprasional/oprasionalService'
import HeaderPage from '../../../../components/HeaderPage'
import { Breadcrumbs, Button, Card, Description, Label, Surface, Tab, Table, Tabs } from '@heroui/react'
import { House } from '@gravity-ui/icons'
import KegiatanList from '../-components/oprasional/KegiatanList'

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


    if (isLoading) {
        return <div className="">Loading</div>
    }

  return (
    <div className="mt-10">
        <HeaderPage
        title={`Detail Oprasional`}
        >
            <div className="mt-6">
                <Breadcrumbs>
                <Breadcrumbs.Item>
                    <House />
                </Breadcrumbs.Item>
                <Breadcrumbs.Item onPress={() => navigate({to: '/oprasional/oprasional'})}>
                    Oprasional
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                    Detail
                </Breadcrumbs.Item>
                </Breadcrumbs>
            </div>
        </HeaderPage>

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
                <Tabs variant='secondary'>
                    <Tabs.ListContainer>
                        <Tabs.List>
                            <Tabs.Tab id={'pekerjaan'}>
                                Pekerjaan
                                <Tabs.Indicator />
                            </Tabs.Tab>
                            <Tabs.Tab id={'casbon'}>
                                Casbon
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs.ListContainer>
                    <Tabs.Panel id={'pekerjaan'}>
                        <KegiatanList data={data} />
                    </Tabs.Panel>
                    <Tabs.Panel id={'casbon'}>
                        <div className="">
                            <div className="flex justify-end">
                                <Button onPress={() => navigate({to: '/oprasional/casbon/create'})} variant='secondary'>Permohonan Casbon</Button>
                            </div>
                        </div>
                    </Tabs.Panel>
                </Tabs>
                <div className="mt-4">
                    <Button isDisabled>Submit Approval</Button>
                </div>
            </div>
        </div>
    </div>
  )
}