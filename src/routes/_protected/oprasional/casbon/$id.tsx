import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useCasbonService } from '../../../../services/oprasional/casbonService'
import HeaderPage from '../../../../components/HeaderPage'
import { Breadcrumbs, Button, Card, Checkbox, CheckboxGroup, Label } from '@heroui/react'
import OperasionalComboBox from '../../../../components/input/OperasionalComboBox'
import SelectComponent from '../../../../components/input/SelectComponent'
import CustomerComboBox from '../../../../components/input/CustomerComboBox'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import ListPekerjaan from '../-components/casbon/ListPekerjaan'
import { Link as LinkIcon } from '@gravity-ui/icons'

export const Route = createFileRoute('/_protected/oprasional/casbon/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { id } = useParams({from: '/_protected/oprasional/casbon/$id'})
  const {data, isLoading} = useQuery({
    queryKey: ['casbon-list', id],
    queryFn: () => useCasbonService.detail(id),
    select: (res) => res.data,
    enabled: !!id
  })

  const {control, reset} = useForm()



  useEffect(() => {
    if (data) {
      const temp = []
      if (data.casbon) temp.push('casbon')
      if (data.pembayaran) temp.push('pembayaran')
      if (data.petty_cash) temp.push('petty_cash')

      reset({...data, pcp: temp})
    }
  }, [data, reset])
  
  if (isLoading) {
    return null
  }


  return (
    <div className="">
      <HeaderPage
        breadchrumb={<Breadcrumbs>
          <Breadcrumbs.Item>Casbon</Breadcrumbs.Item>
          <Breadcrumbs.Item>Detail</Breadcrumbs.Item>
          <Breadcrumbs.Item>{data.nomor}</Breadcrumbs.Item>
        </Breadcrumbs>}
      />
    <div className="flex gap-10 mt-6">
      <div className="flex-1 flex-col space-y-4">
        <Card variant='secondary'>
          <Card.Header>
            <Card.Title>No. {data.nomor}</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="flex flex-col gap-4">
              <OperasionalComboBox isDisabled value={data.opr} />
              <Controller
                name='pcp'
                control={control}
                render={({field}) => (
                  <CheckboxGroup value={field.value ?? []} onChange={(e) => field.onChange(e)} className={'flex flex-row gap-10'}>
                      <Checkbox value='pembayaran'>
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Content>
                          <Label>Pembayaran</Label>
                        </Checkbox.Content>
                      </Checkbox>
                      <Checkbox value='casbon'>
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Content>
                          <Label>Casbon</Label>
                        </Checkbox.Content>
                      </Checkbox>
                      <Checkbox value='petycash'>
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Content>
                          <Label>Petty Cash</Label>
                        </Checkbox.Content>
                      </Checkbox>
                  </CheckboxGroup>
                )}
              />
              <Controller
                name='type_pembayaran'
                control={control}
                render={({field}) => (
                  <SelectComponent className={'w-40'} value={field.value ?? ''} onChange={e => field.onChange(e)} label={'Metode Bayar'} placeholder="Pilih" data={[{id: 'CA', label: 'Tunai'}, {id: 'TF', label: 'Transfer'}]} />
                )}
              />
              <Controller 
                name='supplier'
                control={control}
                render={({field}) => (
                  <CustomerComboBox supplier label={'Supplier'} value={field.value ?? ''} onChange={(e) => field.onChange(e)}  className="max-w-sm w-full" />
                )}
              />
              <div className="flex justify-end">
                <Button onPress={() => navigate({to: `/oprasional/oprasional/${data.opr}`})} variant='tertiary'><LinkIcon /> Operasional</Button>
              </div>
            </div>
          </Card.Content>
        </Card>
        
        <ListPekerjaan casbon={data} />
      </div>
      <div className="w-100"></div>
    </div>
    </div>

  )
}
