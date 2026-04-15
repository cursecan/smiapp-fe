import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, functionalUpdate, Link, useParams } from '@tanstack/react-router'
import { usePenawaranService } from '../../../../services/penawaran.service'
import { Accordion, AutocompletePopover, Breadcrumbs, Button, Card, CloseIcon, Description, EmptyState, Input, Label, ListBox, Surface, Tab, Table, Tabs, TextField } from '@heroui/react'
import { CheckDouble, Clock, Dots9, FloppyDisk, House, LocationArrow, LogoDocker, Paperclip } from '@gravity-ui/icons'
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
      reset({...data, customer: data?.customer?.id || '', sumber_penugasan: data?.sumber_penugasan?.id || ''})
    }
  }, [data, reset])


  if (isLoading) {
    return (<>Loading....</>)
  }



  
  


  return <div className="p-4">
    <div className="mb-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href='#'>
          <House />
        </Breadcrumbs.Item>
        <Breadcrumbs.Item href='#'>
          Penawaran
          {/* <Link to={'/komersial/penawaran'}>Penawaran</Link> */}
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>{data?.nama_project.length>50 ? `${data?.nama_project.slice(0,50)}...`: data?.nama_project}</Breadcrumbs.Item>
      </Breadcrumbs>
    </div>
    <div className="">
      <div className="text-xl text-black max-w-4xl w-full font-medium">{data?.nama_project}</div>
    </div>


    {/* Cotnent */}
    <div className="mt-10 flex gap-6">
      <div className="flex-1 space-y-6">
        <div className="space-y-6">
          <TextField>
            <Label>Nama Project</Label>
            <Controller
              name='nama_project'
              control={control}
              render={({field}) => (
                <Input readOnly={!canEdit} {...field} value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} />
              )}
            />
          </TextField>
          <TextField className={'w-72'}>
            <Label>No. Pesanan / Penugasan</Label>
            <Controller
              name='nomor_penugasan'
              control={control}
              render={({field}) => (
                <Input readOnly={!canEdit} {...field} value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} />
              )}
            />
          </TextField>
          <div className="flex gap-3 items-center">
            <Controller
              name='lokasi'
              control={control}
              render={({field}) => (
                <WilayahComboBox readOnly={!canEdit} {...field} value={field.value} onChange={(e) => field.onChange(e)} />
                // <Input readOnly={!canEdit} {...field} value={field.value || ''} onChange={(e) => field.onChange(e.target.value)} />
              )}
            />
            {/* <WilayahComboBox readOnly={!canEdit} /> */}
          </div>
          
          <div className="space-y-3">
            <KapalComboBox readOnly={!canEdit} onSelectionChange={handleAppendKapal} />
            {
              data?.kapal.length > 0 && (
              <Surface>
                <ListBox>
                  {
                    data?.kapal.map(k => {
                      return (
                        <ListBox.Item key={k.id}>
                          <LogoDocker />
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

            {/* <Controller
              name='customer'
              control={control}
              render={({field}) => (
                <CustomerSelect disable={!!data?.sumber_penugasan} {...field} value={field.value} onChange={(e) => field.onChange(e)}  />
              )}

            /> */}
        </div>

        {/* Tabs */}
        <Tabs>
          <Tabs.ListContainer>
            <Tabs.List>
              <Tabs.Tab id={'pekerjaan'}>
                Item Pekerjaan
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id={'dokumen'}>
                Kelengkapan Dokumen
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>

          <Tabs.Panel id={'pekerjaan'}>
            <Pekerjaan id={id} canEdit={canEdit} />
          </Tabs.Panel>
          <Tabs.Panel id={'dokumen'}>
            <div className="">
              daddddd {JSON.stringify(canEdit)}
            </div>
          </Tabs.Panel>
        </Tabs>


        {
          !!data?.sumber_penugasan && (
            <Accordion variant='surface'>
              <Accordion.Item>
                <Accordion.Heading>
                  <Accordion.Trigger>
                    <Label>Email Penugasan</Label>
                    <Accordion.Indicator />
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                  <Accordion.Body>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <div className="">
                          <Label>Pengirim</Label>
                          <div className="">{data?.sumber_penugasan.email_from}</div>
                        </div>
                        <div>
                          { data?.sumber_penugasan?.receive_date && useFormatDate(data?.sumber_penugasan?.receive_date) }
                        </div>
                      </div>
                      <div className='flex flex-col'>
                        <Label>Subject Surat</Label>
                        <span>{data?.sumber_penugasan.subject}</span>
                      </div>
                      <p>
                        {data?.sumber_penugasan.body}
                      </p>
                      {
                        data?.sumber_penugasan.attachments.length > 0 && (

                          <div className="">
                            <Label className='flex gap-2'><Paperclip /> Attachments</Label>
                            <div className="flex flex-col">
                              {
                                data?.sumber_penugasan.attachments.map(t => {
                                  return (
                                    <a href={t.filepath} className=' underline' target='_blank' key={t.id}>
                                      <div className="">{t.filename}</div>
                                    </a>
                                  )
                                })
                              }
                            </div>
                          </div>
                        )
                      }
                    </div>
                  </Accordion.Body>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          )
        }
        

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
            
            {/* <Button isDisabled={!canEdit}>Simpan</Button>
            <Button isDisabled={!canEdit} className={'bg-purple-500'} onPress={handleSubmitApproval}>Ajukan Approval</Button>
            <Button className={'bg-green-600'}>Approval</Button> */}
          </div>
        </div>
        
      </div>
      <div className="flex max-w-xs w-full">
        <div className="">
          <Card>
            <Card.Content>
              <div className="flex flex-col gap-4 divide-y">
                {
                  data?.stepper.map((t, index) => {
                    return (
                      <div className="flex gap-4 pb-4" key={index}>
                        <Button isIconOnly variant="secondary">
                          {
                            t.approved_at && t.is_approve ?
                            <CheckDouble className='size-5' /> :
                            <Clock className='size-5' />
                          }
                        </Button>
                          <div className={`flex-1 ${t.approved_at && t.is_approve && 'text-accent'}`}>
                            <div className="">
                              { t.name }
                            </div>
                            {
                              t.approved_at && <div className="text-sm italic">12 April 2026 12:10 Wib</div>
                            }
                          </div>
                      </div>
                    )
                  })
                }

              </div>

            </Card.Content>
          </Card>
          
        </div>
      </div>
    </div>
  </div>
}
