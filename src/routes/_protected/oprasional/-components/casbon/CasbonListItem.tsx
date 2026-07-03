import { Button, CloseButton, Description, Label, Surface, Table, toast, useOverlayState } from "@heroui/react"
import { formatRupiah } from "../../../../../utils/formatCurrency"
import { Check, Pencil } from "@gravity-ui/icons"
import ModalComponent from "../../../../../components/modals/ModalComponent"
import { Controller, useForm } from "react-hook-form"
import { useEffect } from "react"
import InputText from "../../../../../components/input/InputText"
import CurrencyInput from "../../../../../components/input/CurrencyInput"
import SimpleComboBox from "../../../../../components/input/SimpleComboBox"
import { useSatuanService } from "../../../../../services/masterdata/satuanService"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useItemCasbonService } from "../../../../../services/oprasional/casbonItemService"
import CheckboxInput from "../../../../../components/input/CheckboxInput"
import { useToast } from "../../../../../lib/useToast"

const CasbonListItem = ({item, canEdit=false}) => {

    const total = Number(item.harga) * item.qty
    const state = useOverlayState()
    const toast = useToast()

    const {control, reset, handleSubmit} = useForm()
    const qc = useQueryClient()

    const save_mutation = useMutation({
        mutationFn: ({id, payload}) => useItemCasbonService.update(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['casbon-item-list']}),
            state.close()
        },
        onError: (err) => {
            toast.danger({message: 'Failed', description: err.message})
        }
    })

    const drop_mutation = useMutation({
        mutationFn: () => useItemCasbonService.drop(item?.id),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['casbon-item-list']})
        }
    })

    const onSubmit = (data) => {
        save_mutation.mutate({
            id: item.id,
            payload: data
        })
    }

    useEffect(() => {
        if (item) {
            reset({...item, satuan: item.satuan?.id})
        }
    }, [reset, item])

  return (
    <Table.Row>
        <Table.Cell>
            <div className="flex flex-col">
                <Label>{item.pekerjaan}</Label>
                {
                    item.keterangan && (
                        <Description>{item.keterangan}</Description>
                    )
                }
            </div>
        </Table.Cell>
        <Table.Cell>{item.qty}</Table.Cell>
        <Table.Cell>{item.satuan?.nama_satuan || '-'}</Table.Cell>
        <Table.Cell>{formatRupiah(item.harga)}</Table.Cell>
        <Table.Cell>{formatRupiah(total)}</Table.Cell>
        <Table.Cell>
            {
                item.is_ppn ? <Check /> : '-' 
            }
        </Table.Cell>
        <Table.Cell>
            <div className="flex items-center gap-1">
                <ModalComponent 
                    state={state}
                    buttonTrigger={
                        <CloseButton isDisabled={!canEdit} onPress={state.setOpen} className={'bg-accent text-white'}>
                        <Pencil />
                        </CloseButton>
                    }
                    heading={'Update Item'}
                    hideFooter
                >
                    <div className="">
                        <Surface className="flex flex-col gap-4">
                            <Controller
                                name="pekerjaan"
                                control={control}
                                render={({field}) => (
                                    <InputText label={'Item'} value={field?.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
                                )}
                            />
                            <Controller
                                name="keterangan"
                                control={control}
                                render={({field}) => (
                                    <InputText label={'Catatan'} value={field?.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
                                )}
                            />
                            <Controller
                                name="qty"
                                control={control}
                                render={({field}) => (
                                    <InputText min={1} type={'number'} label={'Volume'} value={field?.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
                                )} 
                            />
                            <Controller
                                name="satuan"
                                control={control}
                                render={({field}) => (
                                    <SimpleComboBox 
                                        label={'Satuan'}
                                        fetchUrl={() => useSatuanService.list()}
                                        fetchDetailUrl={({queryKey}) => useSatuanService.detail(queryKey.at(1))}
                                        query={['satuan-combox-list']}
                                        value={field?.value ?? ''}
                                        onChange={(e) => field.onChange(e)}
                                        filter={(i) => ({...i, name: i.nama_satuan})}
                                    />
                                )} 
                            />
                            <Controller
                                name="harga"
                                control={control}
                                render={({field}) => (
                                    <CurrencyInput label={'Nominal'} value={field?.value ?? ''} onChange={(e) => field.onChange(e)} />
                                )} 
                            />
                            <Controller
                                name='is_ppn'
                                control={control}
                                render={({field}) => (
                                    <CheckboxInput label={'PPn 11%'} value={field.value} onChange={(e) => field.onChange(e)} />
                                )}
                            />
                            <div className="flex items-center justify-end gap-3">
                                <Button onPress={handleSubmit(onSubmit)}>Simpan</Button>
                            </div>
                        </Surface>
                    </div>
                </ModalComponent>
                <CloseButton className={'bg-danger-soft text-danger'} onPress={() => { drop_mutation.mutate()}} isDisabled={!canEdit} />
            </div>

        </Table.Cell>
    </Table.Row>
  )
}

export default CasbonListItem