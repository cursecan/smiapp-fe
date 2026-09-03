import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { useInvoiceService } from '../../../../services/invoice/invoiceService'
import HeaderPage from '../../../../components/HeaderPage'
import { Breadcrumbs, Card, Surface } from '@heroui/react'
import CardStepper from '../../../../components/CardStepper'
import UploadInput from '../../../../components/input/UploadInput'
import InputText from '../../../../components/input/InputText'
import CurrencyInput from '../../../../components/input/CurrencyInput'
import ApprovalButtons from '../../../../components/buttons/ApprovalButtons'
import { useForm } from 'react-hook-form'
import { useSchema } from '../../../../components/useSchema'
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
  
  const {canApprove, stepApprovals} = useSchema(data)
  const {control, handleSubmit, reset, getValues, formState: {isValid}} = useForm({mode: "onChange", defaultValues: data || {}})

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
              <Surface className='space-y-4'>
                <InputText readOnly value={data?.nomor_invoice} label={'No. Invoice'} />
                <InputText readOnly value={data?.opr.penawaran.nama_project} label={'Pekerjaan'} />
                <div className="grid grid-cols-2 gap-3">
                  <InputText readOnly value={data?.customer.full_name} label={'Penerima'} />
                  <InputText readOnly value={data?.customer.company?.company_name} label={'Organisasi'} />
                </div>
                <div className="flex">
                  <CurrencyInput readOnly label={'Nominal'} value={data?.nominal} />
                </div>
              </Surface>

              <Surface className='grid grid-cols-3 gap-3 mt-6'>
                <UploadInput name='Invoice' disableInput value={data?.dok_1} />
                <UploadInput name='Kwitansi' disableInput value={data?.dok_2} />
                <UploadInput name='BA Kesepakatan Harga' disableInput value={data?.dok_3} />
              </Surface>

              <div className="mt-6 flex">
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
              </div>
            </Card.Content>
          </Card>


        </div>
        <div className="w-90">
          <CardStepper stepper={data?.stepper} stepApprovals={stepApprovals} />
        </div>
      </div>
    </div>
  )
}
