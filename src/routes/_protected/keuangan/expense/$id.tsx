import { createFileRoute, useParams } from '@tanstack/react-router'
import HeaderPage from '../../../../components/HeaderPage'
import { useQuery } from '@tanstack/react-query'
import { useExpOprasionalService } from '../../../../services/keuangan/op_expense'
import { Breadcrumbs, Card, Description, Label, Table } from '@heroui/react'
import { formatRupiah } from '../../../../utils/formatCurrency'
import CasbonList from '../-components/oprasional/CasbonList'

export const Route = createFileRoute('/_protected/keuangan/expense/$id')({
  component: RouteComponent,
})

function RouteComponent() {
    const { id } = useParams({from: '/_protected/keuangan/expense/$id'})
    const {data, isLoading} = useQuery({
        queryKey: ['exp-oprasiona-detail', id],
        queryFn: () => useExpOprasionalService.detail(id),
        select: (res) => res.data
    })

    if (isLoading) {
        return <div className="">Loading...</div>
    }

  return (
    <div className="">
        <HeaderPage
            breadchrumb={
                <Breadcrumbs>
                    <Breadcrumbs.Item>Expense</Breadcrumbs.Item>
                    <Breadcrumbs.Item>Detail</Breadcrumbs.Item>
                    <Breadcrumbs.Item>{data?.opr?.penawaran?.nama_project}</Breadcrumbs.Item>
                </Breadcrumbs>
            }
        />
        <div className="mt-6">
            <div className="flex gap-8">
                <div className="w-100">
                    <Card variant='secondary'>
                        <Card.Header>
                            <Card.Title>Penawaran # {data?.opr?.penawaran?.nomor}</Card.Title>
                        </Card.Header>
                        <Card.Content>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-1">
                                    <Description>No. SPK</Description>
                                    <Label>{data?.opr?.penawaran?.nomor_penugasan}</Label>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Description>Project / Nama Pekerjaan</Description>
                                    <Label>{data?.opr?.penawaran?.nama_project}</Label>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Description>Jenis Pekerjaan</Description>
                                    <Label>{data?.opr?.penawaran?.jenis_pekerjaan?.jenis_pekerjaan}</Label>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <Description>Wilayah</Description>
                                    <Label>{data?.opr?.penawaran?.pelabuhan?.nama_pelabuhan}</Label>
                                </div>
                                <Table>
                                    <Table.ScrollContainer>
                                        <Table.Content>
                                            <Table.Header>
                                                <Table.Column isRowHeader></Table.Column>
                                                <Table.Column className={'text-right'}>Amount</Table.Column>
                                            </Table.Header>
                                            <Table.Body>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        Nilai Penawaran
                                                    </Table.Cell>
                                                    <Table.Cell className={'text-right'}>
                                                        { formatRupiah(data?.opr?.nilai_penawaran) }
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        Total Cabon
                                                    </Table.Cell>
                                                    <Table.Cell className={'text-right'}>
                                                        { formatRupiah(data?.total_casbon) }
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>
                                                        Total Exprnse
                                                    </Table.Cell>
                                                    <Table.Cell className={'text-right'}>
                                                        { formatRupiah(data?.total_expense) }
                                                    </Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        </Table.Content>
                                    </Table.ScrollContainer>
                                </Table>
                            </div>
                        </Card.Content>
                    </Card>
                </div>
                <div className="flex-1">
                    <CasbonList data={data?.casbon || []} />
                </div>

            </div>
        </div>
    </div>
  )
}
