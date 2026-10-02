import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate, useParams } from '@tanstack/react-router'
import { usePenawaranService } from '../../../../services/penawaran.service'
import {  Breadcrumbs, Button, Card, CloseButton, Description,  Disclosure,  Label,  Surface, Table, TextArea  } from '@heroui/react'
import { ArrowUpRight, ArrowUpRightFromSquare,  Eye, LogoDocker } from '@gravity-ui/icons'

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
import DateInput from '../../../../components/input/DateInput'
import { useCustomerService } from '../../../../services/customer/customerService'
import LinkButton from '../../../../components/buttons/LinkButton'
import RichTextEditor from '../../../../components/input/RichTextEditor'
import { DynamicComboBoxMultiple } from '../../../../components/input/DynamicComboBox'
import { DynamicComboBoxSingle } from '../../../../components/input/SimpleSingleComboBox'
import NewApprovalButton from '../../../../components/buttons/NewApprovalButtons'
import TabsPekerjaan from '../-components/penawaran/TabsPekerjaan'
// import MultiComboBox from '../../../../components/input/MultiComboBox'

interface Pelabuhan {
  id: string;
  code_pelabuhan: string;
  nama_pelabuhan: string;
  kota: string;
}

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

  const {canEdit, canApprove, hasAuth, canRevise, stepApprovals, currentStep} = useSchema(data)
  const form = useForm({resolver: zodResolver(usePenawaranSchema), mode: "onChange", defaultValues: data || {}})
  const {control, handleSubmit, reset, getValues, formState: {isValid}} = form
  
  
  
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
        jenis_pekerjaan: data?.jenis_pekerjaan, 
        customer: data?.customer?.id || '', 
        sumber_penugasan: data?.sumber_penugasan?.id || '', 
        multi_pelabuhan: data?.multi_pelabuhan}
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
                  <InputText isReadOnly={!canEdit} error={errors?.nama_project} label={"Pekerjaan"} {...field} value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} />
                )}
              />
              <div className="flex gap-6">
                <Controller
                  name='nomor_penugasan'
                  control={control}
                  render={({field}) => (
                    <InputText isReadOnly={!canEdit} error={errors?.nomor_penugasan} label={'No. SPK/PO'} {...field} value={field.value} onChange={(e) => field.onChange(e.target.value)} />
                  )}
                />

                <Controller
                  name='tgl_surat'
                  control={control}
                  render={({field}) => (
                    <DateInput label={'Tanggal SPK'} value={field.value} onChange={(e) => field.onChange(e)} {...field} isReadOnly={!canEdit} />
                  )}              
                />

                <Controller
                  name="jenis_pekerjaan"
                  control={control}
                  render={({field}) => (
                    <DynamicComboBoxSingle
                      label="Jenis Pekerjaan"
                      urlList="/master/jenis-pekerjaan/"
                      itemKey="id"
                      itemLabel="jenis_pekerjaan"
                      // Langsung masukkan objek default di sini
                      value={field?.value} 
                      onChange={field.onChange}
                    />
                  
                  )}
                />

                
              </div>

              <div className="flex gap-6">
                <Controller
                  name='multi_pelabuhan'
                  control={control}
                  render={({field}) => (
                    <DynamicComboBoxMultiple<Pelabuhan>
                      label="Wilayah / Pelabuhan"
                      placeholder="Cari nama wilayah atau pelabuhan.."
                      urlList="/master/pelabuhan/"
                      itemKey="id"
                      itemLabel={(item) => `${item.nama_pelabuhan}`}
                      initialValue={field.value || []}
                      onChange={(e) => {
                        const flatvalue = e.map(i => i.id)
                        console.log(flatvalue);
                        
                        field.onChange(flatvalue)
                      }}
                      className='w-full'
                    />
                  )}
                />
              </div>

              <div className="">
                <Controller
                  name='kapal'
                  control={control}
                  render={({field}) => (
                    <DynamicComboBoxMultiple
                      label="Pilih Kapal"
                      placeholder="Cari nama kapal.."
                      urlList="/master/kapal/"
                      itemKey="id"
                      itemLabel={(item) => `${item.nama_kapal}`}
                      initialValue={field.value || []}
                      onChange={(e) => {
                        const flatvalue = e.map(i => i.id)
                        console.log(flatvalue);
                        
                        field.onChange(flatvalue)
                      }}
                      className='w-full'
                    />
                  )}
                />
              </div>

              <div className="">
                <Controller
                  name='catatan'
                  control={control}
                  render={({field}) => (
                    <TextArea disabled={!canEdit} fullWidth placeholder='Catatan...' value={field.value} onChange={(e) => field.onChange(e.target.value)} />
                  )}
                />
              </div>

              <div className="flex">
                <NewApprovalButton
                  form={form} // 👈 Oper seluruh object form ke ApprovalButtons
                  noValidationSave={true} // Boleh simpan draft tanpa validasi ketat
                  saveOnly
                  isCanApprove={canApprove}
                  isCanEdit={canEdit}
                  queryKey={["detail-penawaran", id]}
                  approvalLabel="Req. Approval Penawaran"
                  // Service API untuk update/edit draft
                  saveFn={(payload) => usePenawaranService.edit(id, payload)}
                  // Service API untuk submit approval
                  submitFn={(payload) => usePenawaranService.submit(id, payload)}
                  onError={(errs) => console.log("Form Validation Errors:", errs)}   
                />
              </div>
              
              
              <DokumenPenawaran canEdit={canEdit} data={data} />
              
              <Pekerjaan penawaran={data} canEdit={canEdit} />
              

              {
                (currentStep.step > 1 && data?.body_html) && (
                  <div className="flex justify-center">
                    <RichTextEditor content={data?.body_html} editable={false} />
                  </div>
                )
              }


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

              <SimpleComboBox
                label={'Pemberi Kerja'}
                query={['customer-comboxsd']}
                fetchUrl={({pageParams, queryKey}) => useCustomerService.list({pageParams, queryKey})}
                fetchDetailUrl={({queryKey}) => useCustomerService.detail(queryKey.at(1))}
                filter={(i) => ({...i, name: `${i.full_name} (${i.email})`, description: i.company?.company_name})}
                value={data?.customer?.id}
                onChange={onChangeCustomer}
                isDisabled={!canEdit}
              />
              

              {
                data?.response_answer && <TextArea value={data?.response_answer} fullWidth readOnly />
              }

              <div className="flex justify-end items-center gap-3">
                {/* <ApprovalButtons
                  noValidationSave
                  postOnly
                  isCanApprove={canApprove}
                  isCanEdit={canEdit}
                  form={{handleSubmit, getValues, isValid}}
                  saveFn={(payload) => usePenawaranService.edit(data.id, payload)}
                  submitFn={(payload) => usePenawaranService.submit(data.id, payload)}
                  queryKey={['detail-penawaran', id]}
                  postLabel='Req. Approval Penawaran'
                  onError={setErrors}
                /> */}
                <NewApprovalButton
                  form={form} // 👈 Oper seluruh object form ke ApprovalButtons
                  noValidationSave={true} // Boleh simpan draft tanpa validasi ketat
                  postOnly
                  isCanApprove={canApprove}
                  isCanEdit={canEdit}
                  queryKey={["detail-penawaran", id]}
                  approvalLabel="Approve"
                  // Service API untuk update/edit draft
                  saveFn={(payload) => usePenawaranService.edit(id, payload)}
                  // Service API untuk submit approval
                  submitFn={(payload) => usePenawaranService.submit(id, payload)}
                  onError={(errs) => console.log("Form Validation Errors:", errs)}   
                />
                {
                  data?.approvals[0]?.step === 4 && hasAuth && (
                    <>
                      <ReplyEmailModal payload={data} isDisabled={data?.has_email_reply || !data?.customer} fnQuery={(payload) => usePenawaranService.reply_email(data?.id, payload)} queryKey={['detail-penawaran', id]} />
                      <DisposisiOperasionalModal isDisabled={!data?.has_email_reply} penawaran={data} />
                    </>
                  )
                }
                {
                  data?.approvals[ 0]?.step >= 3 && (
                    <DownloadPenawaran data={data} />
                  )
                }
                {
                  canRevise && <ReviseComponent penawaran={data} />
                }
              </div>
            </Surface>
            <Surface>
              {
                data.relation_ref.length > 0 && (
                  <div className="mt-6">
                    {
                      data?.relation_ref.map((i, index) => {
                        return (
                          <Link className='button button--secondary' key={i.id} to={`/komersial/penawaran/${i.id}`}>
                            <div className="flex items-center gap-3">
                              { i.nomor }
                              <ArrowUpRightFromSquare />
                            </div>
                          </Link>
                        )
                      })
                    }
                  </div>
                )
              }
            </Surface>
          </Card.Content>
        </Card>



      </div>
      
      <div className="w-72">
        <CardStepper stepper={data?.stepper} stepApprovals={stepApprovals} />

        {
          data?.oprasional && currentStep?.step === 5 && (
            // <div className="flex-1 flex justify-end">
            //   <Button onPress={() => navigate({to: `/oprasional/oprasional/${data.oprasional}`})} variant='tertiary'>
            //     <ArrowUpRightFromSquare />
            //     Lihat Operasional
            //   </Button>
            // </div>

            <LinkButton 
              label={'Check Operasional'}
              to={'/oprasional/oprasional/$id'}
              params={{id: data.oprasional}}
              className={'button--primary button--full-width mt-6'}
            />
          )
        }
      </div>
    </div>
  </div>
}
