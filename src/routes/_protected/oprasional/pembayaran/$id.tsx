import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { useCashService } from '../../../../services/oprasional/cashService'
import { Breadcrumbs, Card, Label, Radio, RadioGroup, Separator } from '@heroui/react'
import { House, TagDollar } from '@gravity-ui/icons'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useEffect } from 'react'
import InputText from '../../../../components/input/InputText'
import DateInput from '../../../../components/input/DateInput'
import SelectComponent from '../../../../components/input/SelectComponent'
import { useJeniPembayaran } from '../../../../constans'
import CustomerComboBox from '../../../../components/input/CustomerComboBox'
import ListRincian from '../-components/ListRincian'
import ApprovalButtons from '../../../../components/buttons/ApprovalButtons'

export const Route = createFileRoute('/_protected/oprasional/pembayaran/$id')({
  component: RouteComponent,
})

function RouteComponent() {
    const { id } = useParams({from: '/_protected/oprasional/pembayaran/$id'})
    
    const {data, isLoading} = useQuery({
        queryKey: ['cashbon-detail', id],
        queryFn: async () => {
            return await useCashService.detail(id)
        },
        select: (data) => data.data
    })

    const {reset, control, handleSubmit} = useForm({defaultValues: data || {}})
    const jenis_pembayaran = useWatch({
        control,
        name: 'jenis_pembayaran'
    })

    // console.log(data);

    useEffect(() => {
        if (data) {
            reset({...data, pemohon: data?.pemohon?.id})
        }
    }, [data, reset])

    if (isLoading) {
        return <div className="">Loading</div>
    }
    

  return (
    <div className="">
        <Card>
            <TagDollar className='size-8 text-orange-500' />
            <Card.Header>
                <Card.Title>Pembayaran</Card.Title>
                <Card.Description>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Beatae, consectetur!
                </Card.Description>
            </Card.Header>
            <Card.Footer>
                <Breadcrumbs>
                    <Breadcrumbs.Item>
                        <House />
                    </Breadcrumbs.Item>
                    <Breadcrumbs.Item>
                        Pembayaran
                    </Breadcrumbs.Item>
                    <Breadcrumbs.Item>
                        { data?.keterangan }
                    </Breadcrumbs.Item>
                </Breadcrumbs>
            </Card.Footer>
        </Card>

        <div className="flex mt-6 gap-10">
            <div className="max-w-sm w-full">
                <Card className='' variant='secondary'>
                    <Card.Header>
                        <Card.Title>Detail Permohonan</Card.Title>
                    </Card.Header>
                    <Separator />
                    <Card.Content>
                        <div className="space-y-6">
                            <Controller 
                                name='keterangan'
                                control={control}
                                render={({field}) => (
                                    <InputText label={'Keterangan'} {...field} value={field.value||''} onChange={(e) => field.onChange(e.target.value)} />
                                )}
                            />

                            <Controller
                                name='due_date'
                                control={control}
                                render={({field}) => (
                                    <DateInput label={'Tanggal'} {...field} value={field.value || ''} onChange={(e) => field.onChange(e)}/>
                                )}
                            
                            />
                            <SelectComponent label={'Type'} data={useJeniPembayaran} />
                            <Controller
                                name='jenis_pembayaran'
                                control={control}
                                render={({field}) => (
                                    <RadioGroup orientation='horizontal' {...field} value={field.value} onChange={(e) => field.onChange(e)}>
                                        <Radio value='CA'>
                                            <Radio.Control>
                                                <Radio.Indicator />
                                            </Radio.Control>
                                            <Radio.Content>
                                                <Label>Cash</Label>
                                            </Radio.Content>
                                        </Radio>
                                        <Radio value='TF'>
                                            <Radio.Control>
                                                <Radio.Indicator />
                                            </Radio.Control>
                                            <Radio.Content>
                                                <Label>Transfer</Label>
                                            </Radio.Content>
                                        </Radio>
                                    </RadioGroup>
                                )}
                            ></Controller>
                            
                            <div className="">
                                {
                                    jenis_pembayaran === 'TF' && (
                                        <div className="">
                                            <Controller
                                                name='pemohon'
                                                control={control}
                                                render={({field}) => (
                                                    <CustomerComboBox label={'Penerima / Rekening Tujuan'} {...field} value={field.value || ''} onChange={(e) => field.onChange(e)} />
                                                )}
                                            />
                                            {/* <div className="mt-2 flex gap-2 items-start">
                                                <div className="">
                                                    <Label>Bank / No. Rekening: </Label>
                                                </div>
                                                <div className="">
                                                    <Label>{data?.pemohon?.no_rekening} ({data?.pemohon?.nama_bank})</Label>
                                                    <div className="text-sm text-gray-800 font-light">
                                                        {data?.pemohon?.nama_rekening}
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    )
                                }
                            </div>

                            
                        </div>
                    </Card.Content>
                </Card>
                {/* <div className="flex justify-end gap-3 items-center mt-6">
                    <Button>Simpan</Button>
                    <Button className={'bg-purple-500'}>Ajukan</Button>
                </div> */}
                <div className="flex justify-end mt-5">
                    <ApprovalButtons 
                        saveFn={(payload) => useCashService.edit(data.id, payload)}
                        submitFn={() => useCashService.submit(data.id)}
                        handleSubmit={handleSubmit}
                        queryKey={['cashbon-detail', id]}
                        isCanEdit
                    />

                </div>
                
            </div>
            <div className="flex-1">
                <ListRincian pembayaran={data} />
            </div>

        </div>



    </div>
  )
}
