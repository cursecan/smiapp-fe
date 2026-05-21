import ModalComponent from '../../../../../components/modals/ModalComponent'
import { Button, CloseButton, Description, Input, Label, TextField, useOverlayState } from '@heroui/react'
import { Pencil } from '@gravity-ui/icons'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useItemPenawaranService } from '../../../../../services/penawaran.service'
import CurrencyInput from '../../../../../components/input/CurrencyInput'

const UpdateItemModal = ({item}) => {
    const state = useOverlayState()
    const [dataForm, setDataForm] = useState({...item})

    const qc = useQueryClient()
    const mutation = useMutation({
        mutationFn: async ({id, payload}) => {
            return await useItemPenawaranService.edit(id, payload)
        },
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['item-penawaran']})
            state.close()
        }
    })

    const handleSave = () => {
        mutation.mutate({id: item.id, payload: dataForm})
    }

    console.log(dataForm);
    

  return (
    <ModalComponent
        state={state}
        size={'lg'}
        hideFooter
        iconComponent={<Pencil className='size-5' />}
        heading={'Update Item'}
        buttonTrigger={<CloseButton className={'bg-accent text-accent-foreground'} onPress={state.setOpen} isIconOnly size='sm'><Pencil /></CloseButton>}
    >
        <div className="p-1 mt-6 space-y-6">
            <TextField>
                <Label>{ dataForm.is_header ? 'Header' : 'Pekerjaan'}</Label>
                <Input value={dataForm.barang_jasa} onChange={(e) => setDataForm({...dataForm, barang_jasa:e.target.value})} />
            </TextField>
            {
                !dataForm.is_header && (
                    <>
                        <div className="flex gap-5">
                            <TextField>
                                <Label>Volume</Label>
                                <Input type='number' value={dataForm.qty} onChange={(e) => setDataForm({...dataForm, qty:e.target.value})} />
                            </TextField>
                            <TextField>
                                <Label>Satuan</Label>
                                <Input value={'Slot'} />
                            </TextField>
                        </div>
                        <TextField>
                            <Label>Biaya HPP</Label>
                            <CurrencyInput value={dataForm.harga_hpp} onChange={(e) => setDataForm({...dataForm, harga_hpp: e})}  />
                            {/* <Input type='number' value={dataForm.harga_hpp} onChange={(e) => setDataForm({...dataForm, harga_hpp:e.target.value})} /> */}
                            <Description>Biaya dapat disesuaikan dengan harga vendor.</Description>
                        </TextField>
                        <TextField>
                            <Label>Biaya Satuan</Label>
                            <CurrencyInput value={dataForm.harga_satuan} onChange={(e) => setDataForm({...dataForm, harga_satuan: e})} />
                            {/* <Input type='number' value={dataForm.harga_satuan} onChange={(e) => setDataForm({...dataForm, harga_satuan:e.target.value})} /> */}
                            <Description>Estimasi biaya sesuai invoice.</Description>
                        </TextField>
                        <TextField>
                            <Label>Keterangan</Label>
                            <Input value={dataForm.keterangan} onChange={(e) => setDataForm({...dataForm, keterangan: e.target.value})}/>
                        </TextField>
                    </>

                )
            }
            <div className="flex justify-end gap-3">
                <Button slot={'close'} variant='tertiary'>Batal</Button>
                <Button onPress={handleSave}>Simpan</Button>
            </div>
        </div>
    </ModalComponent>
  )
}

export default UpdateItemModal