import { Button, Chip, Table } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { usePenawaranService } from '../../../../services/penawaran.service'
import { useState } from 'react'
import ModalPenawaran from '../-components/penawaran/ModalPenawaran'
import { useFormatDate } from "../../../../utils/dateFormat"


export const Route = createFileRoute('/_protected/komersial/penawaran/')({
  component: RouteComponent,
})

function RouteComponent() {
  const limit = 10
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState()
  const {data: penawaran} = useQuery({
    queryKey: ['penawaran-list', page, search],
    queryFn: async({queryKey}) => usePenawaranService.getList({limit, page: queryKey[1] , q: queryKey[2]}),
    select: (data) => data.data
  })
  

  return (
    <div className="p-4">
      <div className="text-xl font-semibold">Penawaran Pekerjaan</div>

      {/* content */}
      <div className="space-y-6">
        <div className="flex items-center">
          <div className="flex-1"></div>
          <div className="">
            <ModalPenawaran />
          </div>
        </div>

        <Table>
          <Table.ScrollContainer>
            <Table.Content>
              <Table.Header>
                <Table.Column isRowHeader>
                  Penawaran Project
                </Table.Column>
                <Table.Column>
                  No. Surat Pesanan
                </Table.Column>
                {/* <Table.Column>
                  Perihal Surat
                </Table.Column> */}
                <Table.Column>
                  Kapal
                </Table.Column>
                <Table.Column>
                  Wilayah
                </Table.Column>
                <Table.Column>
                  Customer
                </Table.Column>
                <Table.Column>
                  Status
                </Table.Column>
                <Table.Column>
                  Create At
                </Table.Column>
              </Table.Header>
              <Table.Body>
                {
                  penawaran?.results.map(i => {
                    return (
                      <Table.Row key={i.id}>
                        <Table.Cell>
                          <Link to={`${i.id}`}>{i.nama_project}</Link>
                        </Table.Cell>
                        <Table.Cell>{i.nomor_penugasan}</Table.Cell>
                        {/* <Table.Cell>{i.judul_penugasan}</Table.Cell> */}
                        <Table.Cell>
                          <div className="flex flex-col gap-1">
                            { i.kapal.length > 0 && i.kapal.map(p => {
                              return <Chip key={p.id}>{p.nama_kapal}</Chip>
                            })}
                          </div>
                        </Table.Cell>
                        <Table.Cell>{i.lokasi}</Table.Cell>
                        <Table.Cell className={'truncate'}>
                          <div className="flex flex-col">
                            <div className="">{i.customer?.full_name}</div>
                            <div className="">{i.customer?.company?.company_name || "-"}</div>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <Chip variant='soft' color='accent'>
                            {
                              i.status[0].name 
                            }
                          </Chip>
                        </Table.Cell>
                        <Table.Cell>
                          {useFormatDate(i.create_at)}
                        </Table.Cell>
                      </Table.Row>
                    )
                  })
                }
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
    </div>
  )
}
