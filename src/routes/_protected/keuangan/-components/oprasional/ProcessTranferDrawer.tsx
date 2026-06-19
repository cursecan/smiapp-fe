
import { useState } from 'react'
import DrawerComponent from '../../../../../components/DrawerComponent'

const ProcessTranferDrawer = () => {
    
  return (
    <DrawerComponent  state={state} heading={item.nomor} buttonTrigger={
        <Button onPress={state.setOpen}>Action</Button>
        }
        footerButtons={
            <>
                <Button  onPress={expanse_state.setOpen}>Process Bukti Transfer</Button>
            </>
        }
    >  
        <div className="space-y-5 flex flex-col">
            <Label>{item.nama_project}</Label>
            <div className="flex gap-4">
                <CheckboxInput label={'Pembayaran'} value={!!item.pembayaran} />
                <CheckboxInput label={'Casbon'} value={!!item.casbon} />
                <CheckboxInput label={'Petty Cash'} value={!!item.petty_cash} />
            </div>
            <div className="flex gap-4">
                <CheckboxInput label={'Transfer'} value={item.type_pembayaran==='TF'} />
                <CheckboxInput label={'Cash'} value={item.type_pembayaran==='CA'} />
            </div>
            <div className="flex flex-col gap-1">
                <Description>Pemohon</Description>
                <Label>{item.create_by.full_name} { item.create_by.pegawai && <span>({item.create_by.pegawai.jabatan})</span>}</Label>
            </div>
            <div className="flex items-center">
                <div className="flex flex-col gap-1 flex-1">
                    <Description>Supplier</Description>
                    <Label>{item.supplier.company ? item.supplier.company.company_name : item.supplier.full_name}</Label>
                </div>
                <div className="flex flex-col gap-1 flex-1">
                    <Description>No. NPWP</Description>
                    <Label>-</Label>
                </div>
            </div>
            <div className="flex flex-col gap-1 flex-1">
                <Description>Rekening</Description>
                <Label className="uppercase">{item.bank_rekening??'-'} {item.nama_rekening??'-'}</Label>
            </div>
            <ItemList casbon={item} data={casbonItem} />
            <div className="flex gap-3">
                
            </div>
        </div>
    </DrawerComponent>
  )
}

export default ProcessTranferDrawer