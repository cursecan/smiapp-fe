import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { usePenawaranService } from '../../../../services/penawaran.service'
import {  Breadcrumbs, Button, Card, CloseButton, Description,  Disclosure,  Label,  Surface, Table, TextArea  } from '@heroui/react'
import { ArrowUpRightFromSquare,  Eye, LogoDocker } from '@gravity-ui/icons'

import { formatDate } from '../../../../utils/dateFormat'
import KapalComboBox from '../../../../components/input/KapalComboBox'
import { useSchema } from '../../../../components/useSchema'
import { useEffect, useState } from 'react'
import { useForm, Controller } from "react-hook-form"
import InputText from '../../../../components/input/InputText'
import HeaderPage from '../../../../components/HeaderPage'
import ApprovalButtons from '../../../../components/buttons/ApprovalButtons'
import Pekerjaan from '../-components/penawaran/tabs/Pekerjaan'


import { zodResolver } from "@hookform/resolvers/zod"
import { usePenawaranSchema } from '../../../../schemas/penawaranSchema'
import CustomerComboBox from '../../../../components/input/CustomerComboBox'
import DokumenPenawaran from '../-components/penawaran/DokumenPenawaran'
import ReplyEmailModal from '../-components/penawaran/ReplyEmailModal'
import DisposisiOperasionalModal from '../-components/penawaran/DisposisiOperasionalModal'
import DownloadPenawaran from '../-components/penawaran/DownloadPenawaran'
import CardStepper from '../../../../components/CardStepper'
import SimpleComboBox from '../../../../components/input/SimpleComboBox'
import { usePelabuhanService } from '../../../../services/masterdata/pelabuhanService'
import { useJenisPekerjaanService } from '../../../../services/masterdata/jenisPekerjaanService'
import ReviseComponent from '../-components/penawaran/ReviseComponent'

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
  const [pelabuhan, setPelabuhan] = useState(null)

  const {canEdit, canApprove, hasAuth, canRevise} = useSchema(data)
  const {control, handleSubmit, reset, getValues, formState: {isValid}} = useForm({resolver: zodResolver(usePenawaranSchema), mode: "onChange", defaultValues: data || {}})
  
  
  
  const qc  = useQueryClient()
  const mutation = useMutation({
    mutationFn: async ({id, payload}) => {
      return await usePenawaranService.append_kapal(id, payload)
    },
    onSuccess: () => {
      qc.invalidateQueries({queryKey: ['detail-penawaran', id]})
      setkapal('')
    }
  })

  const remove_mutation = useMutation({
    mutationFn: async ({id, payload}) => {
      return await usePenawaranService.remove_kapal(id, payload)
    },
    onSuccess: () => {
      qc.invalidateQueries({queryKey: ['detail-penawaran', id]})
    }
  })


  const handleAppendKapal = (e) => {
    setkapal(e)
    mutation.mutate({id, payload: {kapal_id: e}})
  }

  const handleRemoveKapal = (e) => {
    remove_mutation.mutate({id, payload: {kapal_id: e}})
  }


  const update_customer_mutt = useMutation({
    mutationFn: (payload) => usePenawaranService.update_customer(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ['detail-penawaran', id]
      })
    }
  })

  const onChangeCustomer = (e) => {
    update_customer_mutt.mutate({customer_id: e})
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


  useEffect(() => {
    if (data) {
      setPelabuhan(data?.pelabuhan)
    }
  }, [])


  if (isLoading) {
    return (<>Loading....</>)
  }
  

  return <div className="">
    <HeaderPage
      title={`Detail Penawaran`}
      breadchrumb={<Breadcrumbs>
        <Breadcrumbs.Item>Penawaran</Breadcrumbs.Item>
        <Breadcrumbs.Item isDisabled>Detail</Breadcrumbs.Item>
        <Breadcrumbs.Item>{data?.nomor}</Breadcrumbs.Item>
      </Breadcrumbs>}
    >
    </HeaderPage>

    <div className="flex gap-2">
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
                    <SimpleComboBox
                      label={'Jenis Pekerjaan'}
                      filter={(i) => ({...i, name: i.jenis_pekerjaan})}
                      fetchUrl={() => useJenisPekerjaanService.list()}
                      fetchDetailUrl={({queryKey}) => useJenisPekerjaanService.detail(queryKey.at(1))}
                      query={['jenis-pek-combox-list']}
                      value={field?.value ?? ''}
                      onChange={(e) => field.onChange(e)}
                    />
                  
                  )}
                />

                <Controller
                  name='pelabuhan'
                  control={control}
                  render={({field}) => (
                    <SimpleComboBox 
                      label={'Pelabuhan'}
                      filter={(i) => ({...i, name: i.nama_pelabuhan})}
                      fetchUrl={({ pageParam, queryKey }) => usePelabuhanService.list({pageParam, queryKey})}
                      fetchDetailUrl={({queryKey}) => usePelabuhanService.detail(queryKey.at(1))}
                      query={['pelabuhan-combox']}
                      value={field?.value ?? ''}
                      onChange={(e) => field.onChange(e)}
                     />
                  )}
                />
              </div>
              
              <Surface className='rounded-xl p-3'>
                  { canEdit && (
                    <div className="flex items-center gap-3 mb-3">
                      <Label> Pilih Kapal : </Label>
                      <KapalComboBox readOnly={!canEdit} value={kapal} onChange={handleAppendKapal} />
                      <div className="flex-1 flex justify-end">
                        <Label className="text-gray-700">{data?.kapal.length} Kapal</Label>
                      </div>
                      {/* <Button onPress={handleAppendKapal} variant='secondary'>Add Kapal</Button> */}
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
                                    <CloseButton className={canEdit && 'bg-danger-soft text-danger'} isDisabled={!canEdit} onPress={() => handleRemoveKapal(k.id)} />
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
              
              <Pekerjaan penawaran={data} canEdit={canEdit} />


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
                              <Label>{formatDate(data?.sumber_penugasan?.receive_date)}</Label>
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

              {/* <Controller
                name='customer'
                control={control}
                render={({field}) => (
                  <CustomerComboBox isDisabled={!!data?.customer} label={'Pemberi Kerja'} {...field} value={field.value || ''} onChange={(e) => field.onChange(e)} />
                )}
              /> */}

              <div className="">
                <Controller
                  name='catatan'
                  control={control}
                  render={({field}) => (
                    <TextArea disabled={!canEdit} fullWidth placeholder='Catatan...' value={field.value} onChange={(e) => field.onChange(e.target.value)} />
                  )}
                />
              </div>

              <CustomerComboBox isDisabled={!!data?.sumber_penugasan} label={'Pemberi Kerja'} value={data?.customer?.id} onChange={onChangeCustomer} />

              <div className="flex items-center gap-3">
                <ApprovalButtons
                  noValidationSave
                  isCanApprove={canApprove}
                  isCanEdit={canEdit}
                  form={{handleSubmit, getValues, isValid}}
                  saveFn={(payload) => usePenawaranService.edit(data.id, payload)}
                  submitFn={(payload) => usePenawaranService.submit(data.id, payload)}
                  queryKey={['detail-penawaran', id]}
                  onError={setErrors}
                />
                {
                  data?.approvals[0]?.step === 3 && hasAuth && (
                    <>
                      <ReplyEmailModal payload={data} isDisabled={data?.has_email_reply || !data?.customer} fnQuery={(payload) => usePenawaranService.reply_email(data?.id, payload)} queryKey={['detail-penawaran', id]} />
                      <DisposisiOperasionalModal isDisabled={!data?.has_email_reply} penawaran={data} />
                    </>
                  )
                }
                {
                  data?.approvals[ 0]?.step >= 2 && (
                    <DownloadPenawaran data={data} />
                  )
                }
                {
                  canRevise && <ReviseComponent penawaran={data} />
                }
                {
                  data?.oprasional && (
                    <div className="flex-1 flex justify-end">
                      <Button onPress={() => navigate({to: `/oprasional/oprasional/${data.oprasional}`})} variant='tertiary'>
                        <ArrowUpRightFromSquare />
                        Lihat Operasional
                      </Button>
                    </div>
                  )
                }
              </div>

            </Surface>
          </Card.Content>
        </Card>

      </div>
      
      <div className="w-72">
        <CardStepper stepper={data?.stepper} />
      </div>
    </div>
  </div>
}
