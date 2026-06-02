import { createFileRoute, useNavigate, useParams, useSearch } from '@tanstack/react-router'
import HeaderPage from '../../../../components/HeaderPage'
import { Breadcrumbs, Button, Card, Checkbox, CheckboxGroup, Label } from '@heroui/react'
import InputText from '../../../../components/input/InputText'
import SelectComponent from '../../../../components/input/SelectComponent'
import CustomerComboBox from '../../../../components/input/CustomerComboBox'
import {  useState } from 'react'
import OperasionalComboBox from '../../../../components/input/OperasionalComboBox'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCasbonService } from '../../../../services/oprasional/casbonService'

export const Route = createFileRoute('/_protected/oprasional/casbon/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const t = Route.useSearch()
  
  const [form, setForm] = useState({
    opr: t.ref ?? '',
    tkp: ['pembayaran'],
    type_pembayaran: '',
    supplier: ''
  })


  const qc = useQueryClient()

  const mutate = useMutation({
    mutationFn: (payload) => useCasbonService.create(payload),
    onSuccess: (res) => {
      navigate({to: `/oprasional/casbon/${res.data.id}`})
    }
  })

  const handleSubmit = () => {
    mutate.mutate({...form, pembayaran: form.tkp.includes('pembayaran'), casbon: form.tkp.includes('casbon'), petty_cash: form.tkp.includes('petty_cash')})
  }

  return (
    <div className="">
      <HeaderPage
        title='Permohonan Casbon'
        breadchrumb={<Breadcrumbs>
          <Breadcrumbs.Item>Cashbon</Breadcrumbs.Item>
          <Breadcrumbs.Item>Permohonan</Breadcrumbs.Item>
        </Breadcrumbs>}
      />
      <div className="flex">
        <div className="flex-1 flex flex-col gap-4">
          <Card variant='secondary'>
            <Card.Content>
              <div className="flex flex-col gap-4">
                {/* <div className="flex">
                  <InputText isDisabled label={'Nomor Pengajuan'} placeholder={'EFOFIN.1000'} />

                </div> */}
                <OperasionalComboBox isDisabled value={form.opr} onChange={(e) => setForm({...form, opr:e})} />
                <CheckboxGroup value={form.tkp} onChange={(e) => setForm({...form, tkp: e})} className={'flex flex-row gap-10'}>
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
                <SelectComponent className={'w-40'} value={form.type_pembayaran} onChange={e => setForm({...form, type_pembayaran: e})} label={'Metode Bayar'} placeholder="Pilih" data={[{id: 'CA', label: 'Tunai'}, {id: 'TF', label: 'Transfer'}]} />
                <CustomerComboBox supplier label={'Supplier'} value={form.supplier} onChange={(e) => setForm({...form, supplier: e})}  className="max-w-sm w-full" />
                <div className="flex justify-end">
                  <Button onPress={handleSubmit}>Simpan</Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
        <div className="w-100"></div>
      </div>
    </div>
  )
}
