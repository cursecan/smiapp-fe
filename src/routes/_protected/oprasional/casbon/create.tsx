import { createFileRoute, useNavigate } from '@tanstack/react-router'
import HeaderPage from '../../../../components/HeaderPage'
import { Alert, Breadcrumbs, Button, Card, Checkbox, Label, Radio, RadioGroup } from '@heroui/react'
import SelectComponent from '../../../../components/input/SelectComponent'
import {  useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useCasbonService } from '../../../../services/oprasional/casbonService'
import { useToast } from '../../../../lib/useToast'
import SimpleComboBox from '../../../../components/input/SimpleComboBox'
import { useCustomerService } from '../../../../services/customer/customerService'
import { useOprasionalService } from '../../../../services/oprasional/oprasionalService'

export const Route = createFileRoute('/_protected/oprasional/casbon/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const t = Route.useSearch()
  const toast = useToast()
  
  
  const [form, setForm] = useState({
    opr: t.ref ?? '',
    pembayaran: true,
    tkp: 'petty_cash',
    type_pembayaran: 'TF',
    supplier: ''
  })


  const mutate = useMutation({
    mutationFn: (payload) => useCasbonService.create(payload),
    onSuccess: (res) => {
      navigate({to: `/oprasional/casbon/${res.data.id}`})
    },
    onError: (err) => {
      toast.danger({message: 'Failed', description: err.message})
    }
  })

  useEffect(() => {
    if (form.tkp === 'petty_cash') {
      setForm({...form, supplier: '', type_pembayaran: 'TF'})
    }
  }, [form.tkp])

  const handleSubmit = () => {
    mutate.mutate({...form, casbon: form.tkp==='casbon', petty_cash: form.tkp==='petty_cash'})
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
                <SimpleComboBox
                  label={'Dasar Pekerjaan'}
                  fetchUrl={({pageParam, queryKey}) => useOprasionalService.active_list({pageParam, queryKey})}
                  filter={(i) => ({...i, name: i.pekerjaan})}
                  fetchDetailUrl={({queryKey}) => useOprasionalService.detail(queryKey.at(1))}
                  query={['op-combox-list']}
                  value={form.opr}
                  onChange={(e) => setForm({...form, supplier: e})}
                  isReadOnly
                />

                <Checkbox value={form.pembayaran} onChange={(e) => setForm({...form, pembayaran: e})}>
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Content>
                    <Label>Pembayaran</Label>
                  </Checkbox.Content>
                </Checkbox>
                <RadioGroup orientation='horizontal' value={form.tkp} onChange={(e) => setForm({...form, tkp: e})}>
                  <Radio value='petty_cash'>
                      <Radio.Control>
                        <Radio.Indicator />
                      </Radio.Control>
                      <Radio.Content>
                        <Label>Petty Cash</Label>
                      </Radio.Content>
                  </Radio>
                  <Radio value='casbon'>
                      <Radio.Control>
                        <Radio.Indicator />
                      </Radio.Control>
                      <Radio.Content>
                        <Label>Casbon</Label>
                      </Radio.Content>
                  </Radio>
                </RadioGroup>
                {
                  form.tkp !== 'petty_cash' ? (
                    <>
                      <SelectComponent className={'w-40'} value={form.type_pembayaran} onChange={e => setForm({...form, type_pembayaran: e})} label={'Metode Bayar'} placeholder="Pilih" data={[{id: 'CA', label: 'Tunai'}, {id: 'TF', label: 'Transfer'}]} />
                      <SimpleComboBox
                        label={'Supplier / Pemohon'}
                        fetchUrl={({pageParam, queryKey}) => useCustomerService.supplier({pageParam, queryKey})}
                        filter={(i) => ({...i, name: i.full_name})}
                        fetchDetailUrl={({queryKey}) => useCustomerService.detail(queryKey.at(1))}
                        query={['supplier-combox']}
                        value={form.supplier}
                        onChange={(e) => setForm({...form, supplier: e})}
                      />
                    </>
                  ) : (
                    <Alert>
                      <Alert.Indicator />
                      <Alert.Content>
                        <Alert.Title>Pengajuan Pembayaran Petty Cash</Alert.Title>
                        <Alert.Description>
                            Pengajuan untuk pelakukan pembayaran PNBP dan biaya operasional dadakan menggunakan kas kecil.
                        </Alert.Description>
                      </Alert.Content>
                    </Alert>
                  )
                }
                
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
