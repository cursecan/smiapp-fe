import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { useInvoiceService } from '../../../../services/invoice/invoiceService'
import HeaderPage from '../../../../components/HeaderPage'
import { Breadcrumbs, Card, Surface } from '@heroui/react'
import CardStepper from '../../../../components/CardStepper'
import UploadInput from '../../../../components/input/UploadInput'
import InputText from '../../../../components/input/InputText'
import CurrencyInput from '../../../../components/input/CurrencyInput'
import ApprovalButtons from '../../../../components/buttons/ApprovalButtons'
import { Controller, useForm } from 'react-hook-form'
import { useSchema } from '../../../../components/useSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useInvoiceSchema } from '../../../../schemas/invoiceSchema'
import SubmitButton from '../../../../components/buttons/SubmitButton'
import { useEffect, useState } from 'react'
import DocEditor from '../../../../components/input/DocEditor'
import RichTextEditor from '../../../../components/input/RichTextEditor'
import BaKesepakatanModal from '../-components/BaKesepakatanModal'
import InvoiceModalPreview from '../-components/InvoiceModalPreview'
import KwitansiModal from '../-components/KwitansiModal'
import DownloadButton from '../../../../components/buttons/DownloadButton'
export const Route = createFileRoute('/_protected/invoice/invoice/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({from: '/_protected/invoice/invoice/$id'})
  
  const {data, isLoading} = useQuery({
    queryKey: ['invoice-detail', id],
    queryFn: () => useInvoiceService.detail(id),
    select: (res) => res.data,
    enabled: !!id
  })

  
  const {canApprove, canEdit, stepApprovals} = useSchema(data)
  const {control, handleSubmit, reset, getValues, formState: {isValid}} = useForm({resolver: zodResolver(useInvoiceSchema), mode: "onChange", defaultValues: data || {}})

  const qc = useQueryClient()

  const generateMutation = useMutation({
    mutationFn: () => useInvoiceService.generate(id),
    onSuccess: () => {
      qc.invalidateQueries({queryKey: ['invoice-detail', id]})
    }
  })

  // useEffect(() => {
  //   if (data) {
  //     reset({...data})
  //   }
  // }, [data, reset])



  if (isLoading) {
    return <div className="">Loading...</div>
  }


  return (
    <div className="">
      <HeaderPage
        title={`Detail Penawaran`}
        breadchrumb={<Breadcrumbs>
          <Breadcrumbs.Item>Invoice</Breadcrumbs.Item>
          <Breadcrumbs.Item isDisabled>Detail</Breadcrumbs.Item>
          <Breadcrumbs.Item>{data?.nomor_invoice}</Breadcrumbs.Item>
        </Breadcrumbs>}
      >
      </HeaderPage>


      <div className="flex gap-2">
        <div className="flex-1">
          <Card>
            <Card.Content>
              {/* <Surface className='space-y-4'>
                <Controller
                  name='nomor_invoice'
                  control={control}
                  render={({field}) => (
                    <InputText readOnly value={field.value||''} onChange={(e) => field.onChange(e.target.value)} {...field} label={'No. Invoice'} />
                  )}
                />
                <InputText readOnly value={data?.opr.penawaran.nama_project} label={'Pekerjaan'} />
                <div className="grid grid-cols-2 gap-3">
                  <InputText readOnly value={data?.customer.full_name} label={'Penerima'} />
                  <InputText readOnly value={data?.customer.company?.company_name} label={'Organisasi'} />
                </div>
                <div className="flex">
                  <CurrencyInput readOnly label={'Nominal'} value={data?.nominal} />
                </div>
              </Surface> */}
              <DownloadButton label='Download Invoice' filename={`invoice-${id}.pdf`} urlFetch={`invoice/invoice/${id}/download/`} />
              <RichTextEditor editable={canEdit} content={data?.invoice_html} />
              <DownloadButton label='Download Kwitansi' filename={`kwitansi-${id}.pdf`} urlFetch={`invoice/invoice/${id}/kwitansi/`} />
              <RichTextEditor editable={canEdit} content={data?.kwitansi_html} />
              <DownloadButton label='Download BA Kesepakatan Harga' filename={`ba-kesepakatan-${id}.pdf`} urlFetch={`invoice/invoice/${id}/ba/`} />
              <RichTextEditor editable={canEdit} content={data?.ba_html} />

              {/* <Surface className='grid grid-cols-3 gap-3 mt-6'>
                <UploadInput name='Invoice' disableInput value={data?.dok_1} />
                <UploadInput name='Kwitansi' disableInput value={data?.dok_2} />
                <UploadInput name='BA Kesepakatan Harga' disableInput value={data?.dok_3} />
              </Surface> */}

              <div className="mt-6 flex">
                {/* <div className="flex flex-1 items-center gap-2">
                  <ApprovalButtons
                    noValidationSave
                    saveOnly
                    isCanApprove={false}
                    isCanEdit={canEdit}
                    form={{handleSubmit, getValues, isValid}}
                    saveFn={(payload) => useInvoiceService.update(data?.id, payload)}
                    queryKey={['invoice-detail', id]}
                    approvalLabel='Req. Approval Penawaran'
                  />
                  <SubmitButton className={'bg-danger'} isLoading={generateMutation.isPending} label='Generate' onPress={() => generateMutation.mutate()} />
                  
                </div> */}

                {
                  canEdit && (
                    <ApprovalButtons
                      noValidationSave
                      postOnly
                      isCanApprove={canApprove}
                      form={{handleSubmit, getValues, isValid}}
                      submitFn={(payload) => useInvoiceService.submit(data?.id, payload)}
                      queryKey={['invoice-detail', id]}
                      approvalLabel='Delivery Invoice'
                      // onError={setErrors}
                    />
                  )
                }
              </div>
            </Card.Content>
          </Card>
          {/* <RichTextEditor content={data?.ba_html || ''} /> */}
        </div>
        <div className="w-90 px-5">
          <CardStepper stepper={data?.stepper} stepApprovals={stepApprovals} />
          <div className="mt-6 flex flex-col gap-2">
            {/* <InvoiceModalPreview data={data} />
            <KwitansiModal data={data}/>
            <BaKesepakatanModal data={data} /> */}
            {
              canEdit && (
                <SubmitButton fullWidth className={'bg-danger'} isLoading={generateMutation.isPending} label='Re-Generate Invoice' onPress={() => generateMutation.mutate()} />
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}
