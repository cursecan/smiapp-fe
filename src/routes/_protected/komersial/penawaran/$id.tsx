import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { usePenawaranService } from '../../../../services/penawaran.service'
import {  Breadcrumbs, Button, Card, CloseButton, Description,  Disclosure,  Label,  Surface, Table  } from '@heroui/react'
import { CheckDouble, Clock,  Eye,  House, LogoDocker } from '@gravity-ui/icons'

import { useFormatDate } from '../../../../utils/dateFormat'
import KapalComboBox from '../../../../components/input/KapalComboBox'
import { useSchema } from '../../../../components/useSchema'
import { useEffect, useState } from 'react'
import { useForm, Controller } from "react-hook-form"
import InputText from '../../../../components/input/InputText'
import HeaderPage from '../../../../components/HeaderPage'
import PengadaanBarangComboBox from '../../../../components/input/PengadaanBarangComboBox'
import PelabuhanComboBox from '../../../../components/input/PelabuhanComboBox'
import ApprovalButtons from '../../../../components/buttons/ApprovalButtons'
import Pekerjaan from '../-components/penawaran/tabs/Pekerjaan'


import { zodResolver } from "@hookform/resolvers/zod"
import { usePenawaranSchema } from '../../../../schemas/penawaranSchema'
import CustomerComboBox from '../../../../components/input/CustomerComboBox'
import DokumenPenawaran from '../-components/penawaran/DokumenPenawaran'
import ReplyEmailModal from '../-components/penawaran/ReplyEmailModal'
import DisposisiOperasionalModal from '../-components/penawaran/DisposisiOperasionalModal'
import { useOprasionalService } from '../../../../services/oprasional/oprasionalService'
import DownloadPenawaran from '../-components/penawaran/DownloadPenawaran'

export const Route = createFileRoute('/_protected/komersial/penawaran/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({from: '/_protected/komersial/penawaran/$id'})

  const {data, isLoading} = useQuery({
    queryKey: ['detail-penawaran', id],
    queryFn: async () => usePenawaranService.detail(id),
    select: (data) => data.data
  })

  const navigate = useNavigate()
  const [kapal, setkapal] = useState('')
  const [errors, setErrors] = useState(null)

  const {canEdit, canApprove} = useSchema(data)
  const {control, handleSubmit, reset, getValues, formState: {isValid}} = useForm({resolver: zodResolver(usePenawaranSchema), mode: "onChange", defaultValues: data || {}})
  
  const qc  = useQueryClient()
  const mutation = useMutation({
    mutationFn: async ({id, payload}) => {
      return await usePenawaranService.append_kapal(id, payload)
    },
    onSuccess: (res) => {
      qc.invalidateQueries({queryKey: ['detail-penawaran', id]})
      setkapal('')
    }
  })

  const remove_mutation = useMutation({
    mutationFn: async ({id, payload}) => {
      return await usePenawaranService.remove_kapal(id, payload)
    },
    onSuccess: (res) => {
      qc.invalidateQueries({queryKey: ['detail-penawaran', id]})
    }
  })


  const handleAppendKapal = () => {
    mutation.mutate({id, payload: {kapal_id: kapal}})
  }

  const handleRemoveKapal = (e) => {
    remove_mutation.mutate({id, payload: {kapal_id: e}})
  }


  useEffect(() => {
    if (data) {
      // console.log(data);
      reset({...data, 
        jenis_pekerjaan: data?.jenis_pekerjaan?.id ||'', 
        customer: data?.customer?.id || '', 
        sumber_penugasan: data?.sumber_penugasan?.id || '', 
        pelabuhan: data?.pelabuhan?.id || ''}
      )
    }
  }, [data, reset])


  if (isLoading) {
    return (<>Loading....</>)
  }
  

  return <div className="mt-10">
    <HeaderPage
      title={`Detail Penawaran`}
    >
      <div className="mt-6">
        <Breadcrumbs>
          <Breadcrumbs.Item>
            <House />
          </Breadcrumbs.Item>
          <Breadcrumbs.Item onPress={() => navigate({to: '/komersial/penawaran'})}>
            Penawaran
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>
            Detail
          </Breadcrumbs.Item>
        </Breadcrumbs>
      </div>

    </HeaderPage>

    

    <div className="flex mt-6 gap-10 mb-10">
      <div className="flex-1">
        <Card>
          <Card.Header>
            <Card.Title className={'font-bold'}>NO. {data?.nomor}</Card.Title>
          </Card.Header>
          <Card.Content>
            <Surface className="space-y-6 p-4 rounded-2xl" variant='secondary'>
              <Controller
                name='nama_project'
                control={control}
                render={({field}) => (
                  <InputText isDisabled={!canEdit} error={errors?.nama_project} label={"Pekerjaan"} {...field} value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} />
                )}
              />
              <div className="flex gap-6">
                <Controller
                  name='nomor_penugasan'
                  control={control}
                  render={({field}) => (
                    <InputText isDisabled={!canEdit} error={errors?.nomor_penugasan} label={'No. SPK/PO'} {...field} value={field.value} onChange={(e) => field.onChange(e.target.value)} />
                  )}
                />

                <Controller
                  name="jenis_pekerjaan"
                  control={control}
                  render={({field}) => (
                    <PengadaanBarangComboBox isDisabled={!canEdit} isInvalid={!field.value} {...field} value={field.value || ''} onChange={(e) => field.onChange(e)} />
                  )}
                />

                <Controller
                  name='pelabuhan'
                  control={control}
                  render={({field}) => (
                    // <WilayahComboBox readOnly={!canEdit} {...field} value={field.value} onChange={(e) => field.onChange(e)} />
                    <PelabuhanComboBox isDisabled={!canEdit} isInvalid={!field.value} label={'Palabuhan / Wilayah'} {...field} value={field.value || ''} onChange={(e) => field.onChange(e)} />
                  )}
                />
              </div>
              
              <Surface className='rounded-xl p-3'>
                  { canEdit && (
                    <div className="flex items-center gap-3 mb-3">
                      <Label> Pilih Kapal : </Label>
                      <KapalComboBox readOnly={!canEdit} value={kapal} onChange={setkapal} />
                      <Button onPress={handleAppendKapal} variant='secondary'>Add Kapal</Button>
                    </div>
                  )}
                  <Table>
                    <Table.ScrollContainer>
                      <Table.Content>
                        <Table.Header>
                          <Table.Column isRowHeader></Table.Column>
                          <Table.Column>Nama Kapal</Table.Column>
                          <Table.Column></Table.Column>
                        </Table.Header>
                        <Table.Body >
                          {
                            data?.kapal.map(k => {
                              return (
                                <Table.Row>
                                  <Table.Cell className={'truncate w-0'}>
                                    <LogoDocker />
                                  </Table.Cell>
                                  <Table.Cell>
                                    {k.nama_kapal}
                                  </Table.Cell>
                                  <Table.Cell className={'w-0 truncate'}>
                                    <CloseButton isDisabled={!canEdit} onPress={() => handleRemoveKapal(k.id)} />
                                  </Table.Cell>
                                </Table.Row>
                              )
                            })
                          }
                        </Table.Body>
                      </Table.Content>
                    </Table.ScrollContainer>
                  </Table>
                  {
                    !!errors?.kapal && (
                      <div className="text-sm text-red-500 mt-2">* {errors.kapal.message}</div>
                    )
                  }
              </Surface>
              
              <DokumenPenawaran canEdit={canEdit} data={data} />
              
              <Pekerjaan id={id} canEdit={canEdit} />
              
              {
                data?.sumber_penugasan && (
                  <Surface className='p-3 rounded-2xl text-center'>
                    <Disclosure>
                      <Disclosure.Heading>
                        <Button variant='tertiary' slot={'trigger'}>
                          <Eye />
                          Lihat Email Penugasan
                          <Disclosure.Indicator />
                        </Button>
                      </Disclosure.Heading>
                      <Disclosure.Content>
                        <Disclosure.Body>
                          <div className="text-left space-y-4">
                            <div className="flex flex-col">
                              <Description>Subject</Description>
                              <Label>{data?.sumber_penugasan?.subject}</Label>
                            </div>
                            <div className="flex flex-col">
                              <Description>Receive Date</Description>
                              <Label>{useFormatDate(data?.sumber_penugasan?.receive_date)}</Label>
                            </div>
                            <div className="flex flex-col">
                              <Description>Body</Description>
                              <Label>{data?.sumber_penugasan?.body}</Label>
                            </div>
                          </div>
                        </Disclosure.Body>
                      </Disclosure.Content>
                    </Disclosure>
                  </Surface>
                )
              }

              <Controller
                name='customer'
                control={control}
                render={({field}) => (
                  <CustomerComboBox isDisabled={!!data?.sumber_penugasan} label={'Pemberi Kerja'} {...field} value={field.value || ''} onChange={(e) => field.onChange(e)} />
                )}
              />

              <div className="flex items-center gap-3">
                <ApprovalButtons
                  noValidationSave
                  isCanApprove={canApprove}
                  isCanEdit={canEdit}
                  form={{handleSubmit, getValues, isValid}}
                  saveFn={(payload) => usePenawaranService.edit(data.id, payload)}
                  submitFn={() => usePenawaranService.submit(data.id)}
                  queryKey={['detail-penawaran', id]}
                  onError={setErrors}
                />
                {
                  data?.status[0]?.completed && (
                    <>
                      <ReplyEmailModal payload={data} isDisabled={data?.has_email_reply} fnQuery={(payload) => usePenawaranService.reply_email(data?.id, payload)} queryKey={['detail-penawaran', id]} />
                      <DownloadPenawaran data={data} />
                      <DisposisiOperasionalModal isDisabled={data?.has_ops} fnQuery={() => useOprasionalService.create({penawaran: data.id})} queryKey={['detail-penawaran', id]}  />
                    </>
                  )
                }
              </div>

            </Surface>
          </Card.Content>
        </Card>

      </div>
      
      <div className="w-72">
        <Card>
          <Card.Header>
            <Card.Title>Progress Status</Card.Title>
            <Card.Description>
              Lorem ipsum dolor sit amet.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="flex flex-col gap-6">
              {
                data?.stepper.map((s, index) => {
                  return (
                    <Surface key={index} className='flex items-center gap-6'>
                      <Surface className={`p-2 rounded-xl ${!!s.approved_at ? 'bg-success' : 'bg-amber-100'}`}>
                        {
                          !!s.approved_at ? <CheckDouble /> : <Clock />
                        }
                      </Surface>
                      <Surface className='flex flex-col flex-1'>
                        <Label>{s.name}</Label>
                        {
                          s.approved_at && (
                            <>
                              <Description>{s.step > 1 ? 'Approved' : 'Created'} by {s.approval_by?.full_name}</Description>
                              <Description>{useFormatDate(s.approved_at)}</Description>
                            </>
                          )
                        }
                      </Surface>
                    </Surface>

                  )
                })
              }
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  </div>
}
