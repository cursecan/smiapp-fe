import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useOprasionalService } from '../../../../services/oprasional/oprasionalService'
import HeaderPage from '../../../../components/HeaderPage'
import { Breadcrumbs, Button, Card, CloseButton, Description, Label, Surface, Table, Tabs, TextArea, Tooltip, useOverlayState } from '@heroui/react'
import KegiatanList from '../-components/oprasional/KegiatanList'
import { formatRupiah } from '../../../../utils/formatCurrency'
import { AlmostEqual, ArrowChevronRight, ArrowRightToSquare, Plus } from '@gravity-ui/icons'
import { formatSimpleDate, formatSimpleDate2 } from '../../../../utils/dateFormat'
import StatusChiper from '../../../../components/StatusChiper'
import BARequestModal from '../-components/BARequestModal'
import { useSchema } from '../../../../components/useSchema'
import { useCasbonService } from '../../../../services/oprasional/casbonService'
import InputText from '../../../../components/input/InputText'
import DownloadBAST from '../-components/DownloadBAST'
import TabBast from '../-components/bast/TabBast'
import TabInvoice from '../-components/TabInvoice'
import ApprovalButtons from '../../../../components/buttons/ApprovalButtons'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useOperasionalSchema, usePenawaranSchema } from '../../../../schemas/penawaranSchema'
import { useState } from 'react'
import GenerateInvoiceModal from '../-components/GenerateInvoiceModal'
import CardStepper from '../../../../components/CardStepper'

export const Route = createFileRoute('/_protected/oprasional/oprasional/$id')({
  component: RouteComponent,
})

function RouteComponent() {
    const { id } = useParams({from: '/_protected/oprasional/oprasional/$id'})
    const navigate = useNavigate()
    const [errors, setErrors] = useState(null)
    
    const { data, isLoading } = useQuery({
        queryKey: ['oprasional', id],
        queryFn: async () => {
            return await useOprasionalService.detail(id)
        },
        select: (data) => data.data
    })

    const {control, handleSubmit, reset, getValues, formState: {isValid}} = useForm({resolver: zodResolver(useOperasionalSchema), mode: "onChange", defaultValues: data || {}})
      
      
    
    const {data: casbon, isLoading: casbonLoading} = useQuery({
        queryKey: ['casbon-item-list-ref'],
        queryFn: () => useOprasionalService.casbon(id),
        select: (res) => res.data,
        enabled: !!id
    })

    const total_approved_casbon = casbon?.filter(i => i.is_approve).reduce((a, b) => a + Number(b.total_hpp), 0)
    const unapprove_casbon = casbon?.filter(i => !i.is_approve).reduce((a, b) => a + Number(b.total_hpp), 0)
    const profit = data?.nilai_penawaran - total_approved_casbon

    const dokumen_penugasan = data?.penawaran?.dok_penawaran?.filter(i => i.doc_type !== 'UN') ?? []

    const {canEdit, canApprove, hasAuth} = useSchema(data)

    const mutatePelunasan = useMutation({
        mutationFn: (id) => useCasbonService.pelunasan(id),
        onSuccess: (res) => {
            navigate({to: `/oprasional/casbon/${res.data.id}`})
        }
    })




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

        <div className="my-6 flex gap-6">
            <div className="flex-1 space-y-6">
                <Card>
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
                                    <Label>{formatSimpleDate2(data?.penawaran.tgl_surat)}</Label>
                                </div>
                            </div>
                            <div className="flex gap-6">
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
                            </div>
                            {
                                data?.penawaran.kapal.length > 0 && (
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
                                )
                            }

                            <Surface className='p-3 rounded-2xl space-y-4'>
                                <Table>
                                    <Table.ScrollContainer>
                                        <Table.Content>
                                            <Table.Header>
                                                <Table.Column isRowHeader>
                                                    Dok. Dasar Pekerjaan
                                                </Table.Column>
                                                <Table.Column></Table.Column>
                                            </Table.Header>
                                            <Table.Body>
                                                {
                                                    data?.penawaran.doc_pesanan && (
                                                        <Table.Row>
                                                            <Table.Cell>
                                                                <Label>
                                                                    {data?.penawaran?.nomor}
                                                                </Label>
                                                            </Table.Cell>
                                                            <Table.Cell className={'w-0 truncate'}>
                                                                <a className='text-accent' target='_blank' href={data?.penawaran.doc_pesanan}>
                                                                    <div className="flex items-center gap-1">
                                                                        Download
                                                                        <ArrowRightToSquare />
                                                                    </div>
                                                                </a>
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    )
                                                }
                                                {
                                                    dokumen_penugasan.map(i => {
                                                        return (
                                                            <Table.Row key={i.id}>
                                                                <Table.Cell>
                                                                    <Label>
                                                                        { i.doc_type == 'ND' ? 'Nota Dinas' : 'Surat Pesanan'}
                                                                    </Label>
                                                                </Table.Cell>
                                                                <Table.Cell className={'w-0 truncate'}>
                                                                    <a className='text-accent' target='_blank' href={i.filepath}>
                                                                        <div className="flex items-center gap-1">
                                                                            Download
                                                                            <ArrowRightToSquare />
                                                                        </div>
                                                                    </a>
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        )
                                                    })
                                                }
                                            </Table.Body>
                                        </Table.Content>
                                    </Table.ScrollContainer>
                                </Table>

                                <Table>
                                    <Table.ScrollContainer>
                                        <Table.Content>
                                            <Table.Header>
                                                <Table.Column isRowHeader>
                                                    Progress Dokumen
                                                </Table.Column>
                                            </Table.Header>
                                            <Table.Body>
                                                <Table.Cell>
                                                    <a href={data?.drives.progress} target="_blank" rel="noopener noreferrer">
                                                        {data?.drives.progress}
                                                    </a>
                                                </Table.Cell>
                                            </Table.Body>
                                        </Table.Content>
                                    </Table.ScrollContainer>
                                </Table>
                            </Surface>
                        </Surface>
                    </Card.Content>
                </Card>
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
                                        <Tabs.Indicator className='bg-warning' />
                                    </Tabs.Tab>
                                    {
                                        data?.is_close && (
                                            <Tabs.Tab id={'ba'}>
                                                <span className='truncate'>Dokumen Berita Acara (BA)</span>
                                                <Tabs.Indicator className='bg-danger' />
                                            </Tabs.Tab>
                                        )
                                    }
                                    {
                                        data?.is_close && data?.invoice && (
                                            <Tabs.Tab id={'invoice'}>
                                                <span className='truncate'>Invoice & Kwitansi</span>
                                                <Tabs.Indicator className='bg-warning' />
                                            </Tabs.Tab>
                                        )
                                    }
                                </Tabs.List>
                            </Tabs.ListContainer>
                            <Tabs.Panel id={'pekerjaan'}>
                                <KegiatanList data={data} canEdit={canEdit && hasAuth} />
                            </Tabs.Panel>
                            <Tabs.Panel id={'casbon'}>
                                <div className="">
                                    <div className="flex justify-end mb-5">
                                        <Button isDisabled={!hasAuth} onPress={() => navigate({to: `/oprasional/casbon/create?ref=${data.id}`})} variant='primary' className={'bg-success'}><Plus /> Casbon</Button>
                                    </div>
                                    <Table className='font-mono'>
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
                                                                    <Table.Cell className={'w-40'}>{formatRupiah(i.total_hpp)}</Table.Cell>
                                                                    <Table.Cell className={'w-0 truncate'}>
                                                                        <StatusChiper status={i.status} />
                                                                    </Table.Cell>
                                                                    <Table.Cell className={'truncate'}>
                                                                        <div className="flex items-center justify-end gap-1">
                                                                            {
                                                                                (i.hutang > 0 || i.total_hpp === 0) && (
                                                                                     <Tooltip>
                                                                                        <Tooltip.Trigger>
                                                                                            <CloseButton onPress={() => mutatePelunasan.mutate(i.id)} className={'bg-amber-600 text-white'}>
                                                                                                <AlmostEqual />
                                                                                            </CloseButton>
                                                                                        </Tooltip.Trigger>
                                                                                        <Tooltip.Content>
                                                                                        <Tooltip.Arrow />
                                                                                            Penyelesaian hutang
                                                                                        </Tooltip.Content>
                                                                                    </Tooltip>
                                                                                    
                                                                                )
                                                                            }
                                                                            <CloseButton onPress={() => navigate({to: `/oprasional/casbon/${i.id}`})} className={'bg-accent text-accent-foreground'}>
                                                                                <ArrowChevronRight />
                                                                            </CloseButton>
                                                                        </div>
                                                                    </Table.Cell>
                                                                </Table.Row>
                                                            )
                                                        })
                                                    }
                                                    <Table.Row>
                                                        <Table.Cell colSpan={2} className={'text-right'}>
                                                            Casbon Belum Approval
                                                        </Table.Cell>
                                                        <Table.Cell colSpan={3}>
                                                            {formatRupiah(unapprove_casbon)}
                                                        </Table.Cell>
                                                    </Table.Row>
                                                    <Table.Row>
                                                        <Table.Cell colSpan={2} className={'text-right'}>
                                                            Approved Casbon
                                                        </Table.Cell>
                                                        <Table.Cell colSpan={3}>
                                                            {formatRupiah(total_approved_casbon)}
                                                        </Table.Cell>
                                                    </Table.Row>
                                                    <Table.Row>
                                                        <Table.Cell colSpan={2} className={'text-right'}>
                                                            <b>Nilai Penawaran</b>
                                                        </Table.Cell>
                                                        <Table.Cell colSpan={3}>
                                                            <div className="flex gap-5 items-center">
                                                                <b>
                                                                    {formatRupiah(data?.nilai_penawaran)} 
                                                                </b>
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
                            {
                                data?.is_close && data?.bast && (
                                    <TabBast opr={data} canEdit={canEdit}  />
                                )
                            }

                            {
                                data?.is_close && data?.invoice && (
                                    <TabInvoice opr={data} canEdit={canEdit}  />
                                )
                            }
                        </Tabs>
                        {
                            (data?.approvals[0]?.step > 2 && data?.approvals[0]?.step !== 6) && (
                                <div className="flex gap-3 justify-between">
                                    <div className="">
                                        <ApprovalButtons
                                            noValidationSave
                                            postOnly
                                            isCanApprove={canApprove}
                                            isCanEdit={canEdit}
                                            form={{handleSubmit, getValues, isValid}}
                                            saveFn={() => {} }
                                            submitFn={(payload) => useOprasionalService.submit(id, payload)}
                                            queryKey={['oprasional', id]}
                                            postLabel='Request Approval'
                                            approvalLabel={`Proses ${data?.approvals[0]?.name}`}
                                            onError={setErrors}
                                        />
                                        {
                                            data?.approvals[0]?.step === 5 && <Description className='italic'>* Pastikan download BA sebelum klick Processing BA!</Description>
                                        }
                                    </div>
                                    {
                                        (canApprove && data?.approvals[0]?.step < 6) && <DownloadBAST label={data?.approvals[0]?.step === 5 ? 'Download Singed BA' : 'Preview Berita Acara (BA)'} data={data?.bast} />
                                    }
                                    
                                </div>
                            )
                        }
                    </Card.Content>
                </Card>
                <div className="mt-4 flex items-center gap-3">
                    {
                        (!data?.is_close && hasAuth) && (
                            <BARequestModal oprs={data} />
                        )
                    }
                    {
                        data?.approvals[0]?.step == 7 && !data?.invoice && hasAuth && (
                            <GenerateInvoiceModal opr={data} />
                        )
                    }
                    
                </div>
            </div>
            <div className="w-90">
                <CardStepper stepper={data?.stepper} />
            </div>
        </div>
    </div>
  )
}