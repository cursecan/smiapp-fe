import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, functionalUpdate, Link, useParams } from '@tanstack/react-router'
import { usePenawaranService } from '../../../../services/penawaran.service'
import { Accordion, AutocompletePopover, Avatar, Breadcrumbs, Button, Card, CloseIcon, Description, Disclosure, EmptyState, Input, Label, ListBox, Radio, RadioGroup, Surface, Tab, Table, Tabs, TextField } from '@heroui/react'
import { CheckDouble, Clock, Dots9, FloppyDisk, FolderMagnifier, House, ListCheck, LocationArrow, LogoDocker, Paperclip } from '@gravity-ui/icons'
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
      console.log(data);
      reset({...data, customer: data?.customer?.id || '', sumber_penugasan: data?.sumber_penugasan?.id || ''})
    }
  }, [data, reset])


  if (isLoading) {
    return (<>Loading....</>)
  }



  
  


  return <div className="">
    <Card variant='secondary'>
      <LogoDocker className='size-8' />
      <Card.Footer>
        <Breadcrumbs>
          <Breadcrumbs.Item><House /></Breadcrumbs.Item>
          <Breadcrumbs.Item>Penawaran</Breadcrumbs.Item>
          <Breadcrumbs.Item>{data.nama_project.length > 40 ? data.nama_project.slice(0,40) +'...'  : data.nama_project}</Breadcrumbs.Item>
        </Breadcrumbs>
      </Card.Footer>
    </Card>

    <div className="mt-6 flex gap-10">
      <div className="max-w-3xl w-full space-y-6">
        <Card variant='secondary'>
          <Card.Header>
            <Card.Title title={data?.nama_project} className='text-sky-600 font-semibold text-xl'>{data?.nama_project.length > 100 ? data?.nama_project.slice(0,100) + '...' : data?.nama_project}</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="">
              <div className="space-y-6">
                <TextField>
                  <Label>Nama Pekerjaan</Label>
                  <Controller
                    name='nama_project'
                    control={control}
                    render={({field}) => (
                      <Input readOnly={!canEdit} {...field} value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} />
                    )}
                  />
                </TextField>
                <TextField className={'w-72'}>
                  <Label>No. Pesanan</Label>
                  <Controller
                    name='nomor_penugasan'
                    control={control}
                    render={({field}) => (
                      <Input readOnly={!canEdit} {...field} value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} />
                    )}
                  />
                </TextField>

                <div className="flex gap-6">
                  <div className="flex-1 space-y-2">
                    <KapalComboBox readOnly={!canEdit} onSelectionChange={handleAppendKapal} />
                    {
                      data?.kapal.length > 0 && (
                      <Surface>
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
                      </Surface>
                      )
                    }
                  </div>
                  <div className="flex-1">
                    <PengadaanBarangRadio />
                  </div>
                </div>

                <Controller
                  name='lokasi'
                  control={control}
                  render={({field}) => (
                    <WilayahComboBox readOnly={!canEdit} {...field} value={field.value} onChange={(e) => field.onChange(e)} />
                    // <Input readOnly={!canEdit} {...field} value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} />
                  )}
                />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Pekerjaan id={id} canEdit={canEdit} />

        {/* Submit & Approval */}
        <div className="actions">
          <div className="flex justify-end gap-3">
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

      </div>
      
      <div className="flex-1">
        <div className="bg-white/0 backdrop-blur-sm rounded-2xl">
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
        </div>
      </div>

    </div>
  </div>
}
