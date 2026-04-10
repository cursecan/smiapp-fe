import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { usePenawaranService } from '../../../../services/penawaran.service'
import { Accordion, Breadcrumbs, Card, Input, Label, Surface, Tab, Tabs, TextField } from '@heroui/react'
import { House, Paperclip } from '@gravity-ui/icons'
import KapalSelect from '../../../../components/input/KapalSelect'
import CustomerSelect from '../../../../components/input/CustomerSelect'
import { useFormatDate } from '../../../../utils/dateFormat'
import Pekerjaan from '../-components/penawaran/tabs/Pekerjaan'
import WilayahComboBox from '../../../../components/input/WilayahComboBox'

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


  if (isLoading) {
    return null
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
        <Card variant='transparent'>
          <Card.Content>
            <div className="space-y-6">
              <TextField>
                <Label>Nama Project</Label>
                <Input value={data?.nama_project} />
              </TextField>
              <TextField className={'w-72'}>
                <Label>No. Pesanan / Penugasan</Label>
                <Input value={data?.nomor_penugasan} />
              </TextField>
              <div className="flex gap-3 items-center">
                <WilayahComboBox />
                <div className="flex-1">
                  <KapalSelect value={data?.kapal} />
                </div>

              </div>
              <CustomerSelect disable={!!data?.sumber_penugasan} value={data?.customer?.id} />

            </div>
          </Card.Content>
        </Card>

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
            <Pekerjaan id={id} />
          </Tabs.Panel>
          <Tabs.Panel id={'dokumen'}>
            <div className="">
              daddddd
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
        

        
      </div>
      <div className="flex max-w-xs w-full">
        dada
      </div>
    </div>
  </div>
}
