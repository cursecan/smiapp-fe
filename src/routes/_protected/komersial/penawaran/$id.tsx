import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, functionalUpdate, Link, useParams } from '@tanstack/react-router'
import { usePenawaranService } from '../../../../services/penawaran.service'
import { Accordion, AutocompletePopover, Avatar, Breadcrumbs, Button, Card, CloseIcon, Description, Disclosure, EmptyState, Input, Label, ListBox, Radio, RadioGroup, Surface, Tab, Table, Tabs, TextField } from '@heroui/react'
import { CheckDouble, Clock, Dots9, FloppyDisk, FolderMagnifier, House, ListCheck, LocationArrow, LogoDocker, Paperclip, Timestamps } from '@gravity-ui/icons'
import KapalSelect from '../../../../components/input/KapalSelect'
import CustomerSelect from '../../../../components/input/CustomerSelect'
import { useFormatDate } from '../../../../utils/dateFormat'
import Pekerjaan from '../-components/penawaran/tabs/Pekerjaan'
import WilayahComboBox from '../../../../components/input/WilayahComboBox'
import KapalComboBox from '../../../../components/input/KapalComboBox'
import { useSchema } from '../../../../components/useSchema'
import SubmitButton from '../../../../components/buttons/SubmitButton'
import { useEffect, useState } from 'react'
import { useForm, Controller } from "react-hook-form"
import ApprovalButton from '../../../../components/buttons/ApprovalButton'
import PengadaanBarangRadio from '../../../../components/input/PengadaanBarangRadio'
import InputText from '../../../../components/input/InputText'
import HeaderPage from '../../../../components/HeaderPage'
import PengadaanBarangComboBox from '../../../../components/input/PengadaanBarangComboBox'

export const Route = createFileRoute('/_protected/komersial/penawaran/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = useParams({from: '/_protected/komersial/penawaran/$id'})

  const {data, isLoading} = useQuery({
    queryKey: ['detail-penawaran', id],
    queryFn: async () => usePenawaranService.detail(id),
    select: (data) => data.data
  })

  const {canEdit, canApprove} = useSchema(data)

  const {control, handleSubmit, reset} = useForm({defaultValues: data || {}})

  const qc  = useQueryClient()
  const mutation = useMutation({
    mutationFn: async ({id, payload}) => {
      return await usePenawaranService.append_kapal(id, payload)
    },
    onSuccess: (res) => {
      qc.invalidateQueries({queryKey: ['detail-penawaran', id]})
    }
  })

  const remove_mutation = useMutation({
    mutationFn: async ({id, payload}) => {
      return await usePenawaranService.remove_kapal(id, payload)
    },
    onSuccess: (res) => {
      qc.invalidateQueries({queryKey: ['detail-penawaran', id]})
    }
  })

  const submit_mutation = useMutation({
    mutationFn: async (id) => {
      return await usePenawaranService.submit(id)
    },
    onSuccess: () => {
      qc.invalidateQueries({queryKey: ['detail-penawaran', id]})
    }
  })

  const save_mutation = useMutation({
    mutationFn: async (payload) => {
      return await usePenawaranService.edit(id, payload)
    },
    onSuccess: () => {
      qc.invalidateQueries({queryKey: ['detail-penawaran', id]})
    }
  })

  const handleSaveForm = (dataForm) => {
    save_mutation.mutate(dataForm)
  }

  const handleAppendKapal = (e) => {
    mutation.mutate({id, payload: {kapal_id: e}})
  }

  const handleRemoveKapal = (e) => {
    remove_mutation.mutate({id, payload: {kapal_id: e}})
  }

  const handleSubmitApproval = () => {
    submit_mutation.mutate(id)
  }


  useEffect(() => {
    if (data) {
      // console.log(data);
      reset({...data, customer: data?.customer?.id || '', sumber_penugasan: data?.sumber_penugasan?.id || '', lokasi: data?.lokasi?.id})
    }
  }, [data, reset])


  if (isLoading) {
    return (<>Loading....</>)
  }



  
  


  return <div className="mt-10">
    <HeaderPage
      title={`Detail Penawaran / ${data?.nama_project}`}
    >
       <div className="actions mt-6">
          <div className="flex gap-3">
            {
              canEdit && <Button onPress={handleSubmit(handleSaveForm)}><FloppyDisk /> Simpan</Button>
            }
            {
              canEdit && (
                <SubmitButton handleSubmit={handleSubmitApproval} label={'Ajukan'} heading={'Ajukan Penawaran'} icon={<LocationArrow />}>
                  <div className="">Ajukan penawaran untuk pekerjaan ini?</div>
                </SubmitButton>
              )
            }

            {
              canApprove && (
                <ApprovalButton onApprove={handleSubmitApproval}>
                  <div className="">Silahkan melakukan approval untuk penawaran ini.</div>
                </ApprovalButton>
              )
            }
          </div>
        </div>

    </HeaderPage>

    

    <div className="flex mt-6 gap-10">
      <div className="w-100">
        <Card>
          <Card.Header>
            <Card.Title>Detail Informasi</Card.Title>
          </Card.Header>
          <Card.Content>
            <Card variant='secondary'>
              <Card.Content>
                <div className="space-y-6">
                  <Controller
                    name='nama_project'
                    control={control}
                    render={({field}) => (
                      <InputText label={"Pekerjaan"} readOnly={!canEdit} {...field} value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} />
                    )}
                  />
                  <Controller
                    name='nomor_penugasan'
                    control={control}
                    render={({field}) => (
                      <InputText label={'No. SPK/PO'} {...field} value={field.value} onChange={(e) => field.onChange(e.target.value)} />
                    )}
                  />
                  
                  <Controller
                    name='lokasi'
                    control={control}
                    render={({field}) => (
                      <WilayahComboBox readOnly={!canEdit} {...field} value={field.value} onChange={(e) => field.onChange(e)} />
                      
                    )}
                  />
                  <PengadaanBarangComboBox value={''} onChange={() => {}} />

                  <div className="space-y-2">
                    <KapalComboBox readOnly={!canEdit} value={''} onChange={handleAppendKapal} />
                    {
                      data?.kapal.length > 0 && (
                      <div className='bg-white/40 rounded-2xl'>
                        <ListBox>
                          {
                            data?.kapal.map(k => {
                              return (
                                <ListBox.Item key={k.id}>
                                  <LogoDocker className='text-sky-600' />
                                  <div className="flex flex-1 items-center justify-between">
                                    <Label>{k.nama_kapal}</Label>
                                    {
                                      canEdit && (
                                        <div className="">
                                          <Button onPress={() => handleRemoveKapal(k.id)} isIconOnly size='sm' variant='danger-soft'>
                                            <CloseIcon />
                                          </Button>
                                        </div>
                                      )
                                    }
                                  </div>
                                  
                                </ListBox.Item>
                              )
                            })
                          }
                        </ListBox>
                      </div>
                      )
                    }
                  </div>
                  
                </div>
              </Card.Content>
            </Card>
          </Card.Content>
        </Card>
      </div>

      <div className="flex-1">
        <Pekerjaan id={id} canEdit={canEdit} />
      </div>
      
      <div className="w-72">
        <Card>
          <Card.Header>
            <Card.Title>Progress Status</Card.Title>
            <Card.Description>
              Lorem ipsum dolor sit amet.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="flex flex-col gap-4">
              {
                data?.stepper.map((s, index) => {
                  return (
                    <Surface key={index} className='flex items-center gap-6'>
                      <Surface className={`p-2 rounded-xl ${!!s.approved_at ? 'bg-success' : 'bg-amber-100'}`}>
                        {
                          !!s.approved_at ? <CheckDouble /> : <Clock />
                        }
                      </Surface>
                      <Surface className='flex flex-col flex-1'>
                        <Label>{s.name}</Label>
                        {
                          s.approved_at && (
                            <>
                              <Description>{s.step > 1 ? 'Approved' : 'Created'} by {s.approval_by?.full_name}</Description>
                              <Description>{useFormatDate(s.approved_at)}</Description>
                            </>
                          )
                        }
                      </Surface>
                    </Surface>

                  )
                })
              }

            </div>
          </Card.Content>
        </Card>
        {/* <div className="bg-white/0 backdrop-blur-sm rounded-2xl">
            <div className="p-0 space-y-5">
              {
                data?.stepper.map((s, index) => {
                  return (
                    <Card key={s.id} className='flex-row'>
                      <div className="">
                        {
                          !!s.approved_at ? (
                            <Button isIconOnly className={'bg-success'}>
                              <CheckDouble /> 
                            </Button>
                          ) : (
                            <Avatar>
                              <Avatar.Fallback>{s.step}</Avatar.Fallback>
                            </Avatar>
                          )
                        }
                      </div>
                      <div className="flex-1">
                        <Card.Header className=''>
                          <Card.Title className=''>{s.name}</Card.Title>
                          {
                            s.approved_at &&  (
                              <Card.Description>
                                { index === 0 ? 'Create' : 'Approve'} by {s.approval_by.full_name}
                              </Card.Description>
                            )
                          }
                        </Card.Header>

                      </div>
                    </Card>
                  )
                })
              }
            </div>
        </div> */}
      </div>
    </div>
  </div>
}
