import ModalComponent from '../../../../../components/modals/ModalComponent'
import { Button, CloseButton, Description, Input, Label, Surface, TextArea, TextField, useOverlayState } from '@heroui/react'
import { Pencil, PencilToSquare } from '@gravity-ui/icons'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useItemPenawaranService } from '../../../../../services/penawaran.service'
import CurrencyInput from '../../../../../components/input/CurrencyInput'
import SimpleComboBox from '../../../../../components/input/SimpleComboBox'
import { useSatuanService } from '../../../../../services/masterdata/satuanService'

const UpdateItemModal = ({item}) => {
    const state = useOverlayState()
    const [dataForm, setDataForm] = useState()

    const qc = useQueryClient()
    const {data} = useQuery({
        queryKey: ['item-penawaran-detail', item?.id],
        queryFn: () => useItemPenawaranService.detail(item?.id),
        select: (res) => res.data,
        enabled: !!item.id && !!state.isOpen
    })

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

    useEffect(() => {
        if (data) {
            setDataForm({...data, satuan: data.satuan?.id || '',  parent: data.parent ? data.parent.id : ''})
        }
    }, [data])

  return (
    <ModalComponent
        state={state}
        size={'lg'}
        hideFooter
        hideHeader
        iconComponent={<PencilToSquare className='size-5 text-blue-500' />}
        heading={'Update Item'}
        buttonTrigger={<CloseButton className={'bg-accent text-accent-foreground'} onPress={state.setOpen} isIconOnly size='sm'><Pencil /></CloseButton>}
    >
        <Surface className="p-3 mt-6 space-y-3 rounded-2xl" variant='secondary'>
            <TextField>
                <Label>{ dataForm?.is_header ? 'Header' : 'Pekerjaan'}</Label>
                <Input value={dataForm?.barang_jasa} onChange={(e) => setDataForm({...dataForm, barang_jasa:e.target.value})} />
            </TextField>
            <TextArea className={'h-24'} value={dataForm?.sub_content} onChange={(e) => setDataForm({...dataForm, sub_content: e.target.value})} fullWidth placeholder='Detail sub content...' />
            
            {
                !dataForm?.is_header && (
                    <>
                        <div className="flex gap-5">
                            <TextField>
                                <Label>Volume</Label>
                                <Input type='number' value={dataForm?.qty} onChange={(e) => setDataForm({...dataForm, qty:e.target.value})} />
                            </TextField>

                            {/* <TextField>
                                <Label>Satuan</Label>
                                <Input value={'Slot'} />
                            </TextField> */}
                            <SimpleComboBox
                                label={'Satuan'}
                                query={['satuan-list-combox']}
                                filter={(i) => ({...i, name: i.nama_satuan})}
                                fetchUrl={() => useSatuanService.list()}
                                fetchDetailUrl={({queryKey}) => useSatuanService.detail(queryKey.at(1))}
                                value={dataForm?.satuan}
                                onChange={(e) => setDataForm({...dataForm, satuan: e})}
                            />
                        </div>
                        <div className="flex items-center gap-5">
                            <TextField>
                                <Label>Harga Dasar</Label>
                                <CurrencyInput value={dataForm?.harga_hpp} onChange={(e) => setDataForm({...dataForm, harga_hpp: e})}  />
                                {/* <Input type='number' value={dataForm?.harga_hpp} onChange={(e) => setDataForm({...dataForm, harga_hpp:e.target.value})} /> */}
                                {/* <Description>Harga dapat disesuaikan dengan harga vendor.</Description> */}
                            </TextField>
                            <TextField>
                                <Label>Harga Satuan</Label>
                                <CurrencyInput value={dataForm?.harga_satuan} onChange={(e) => setDataForm({...dataForm, harga_satuan: e})} />
                                {/* <Input type='number' value={dataForm?.harga_satuan} onChange={(e) => setDataForm({...dataForm, harga_satuan:e.target.value})} /> */}
                                {/* <Description>Estimasi biaya sesuai invoice.</Description> */}
                            </TextField>

                        </div>
                        <TextField>
                            <Label>Keterangan</Label>
                            <Input value={dataForm?.keterangan} onChange={(e) => setDataForm({...dataForm, keterangan: e.target.value})}/>
                        </TextField>
                    </>

                )
            }
        </Surface>
        <div className="flex justify-end gap-3 mt-4">
            <Button size='sm' slot={'close'} variant='tertiary'>Batal</Button>
            <Button size='sm' onPress={handleSave}>Simpan Perubahan</Button>
        </div>
    </ModalComponent>
  )
}

export default UpdateItemModal