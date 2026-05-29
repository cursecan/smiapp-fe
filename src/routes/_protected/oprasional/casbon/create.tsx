import { createFileRoute } from '@tanstack/react-router'
import HeaderPage from '../../../../components/HeaderPage'
import { Breadcrumbs, Button, Card, Checkbox, CheckboxGroup, Label, labelVariants, Radio, Surface } from '@heroui/react'
import InputText from '../../../../components/input/InputText'
import SelectComponent from '../../../../components/input/SelectComponent'
import CustomerComboBox from '../../../../components/input/CustomerComboBox'
import CurrencyInput from '../../../../components/input/CurrencyInput'
import { useRef, useState } from 'react'

export const Route = createFileRoute('/_protected/oprasional/casbon/create')({
  component: RouteComponent,
})

function RouteComponent() {
  const [form, setForm] = useState({
    pekerjaan: '',
    qty: 0,
    satuan: '',
    harga: 0
  })

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
                <div className="flex">
                  <InputText label={'Nomor Pengajuan'} placeholder={'EFOFIN.1000'} />

                </div>
                <InputText label={'Pekerjaan'} />
                <CheckboxGroup className={'flex flex-row gap-10'}>
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
                <SelectComponent className={'w-40'} label={'Metode Bayar'} placeholder="Pilih" data={[{id: 'cash', label: 'Tunai'}, {id: 'tf', label: 'Transfer'}]} />
                <CustomerComboBox label={'Supplier'}  className="max-w-sm w-full" />
                <div className="flex justify-end">
                  <Button>Simpan</Button>
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
