import { createFileRoute, useNavigate } from '@tanstack/react-router'
import HeaderPage from '../../components/HeaderPage'
import { Card, Description, Surface, Table } from '@heroui/react'
import PeriodeFilter from '../../components/PeriodeFilter'
import { useQuery } from '@tanstack/react-query'
import { useDashboardService } from '../../services/dashboad/dashboardService'
import { formatRupiah } from '../../utils/formatCurrency'
import { useAuth } from '../../auth/AuthProvider'

export const Route = createFileRoute('/_protected/dashboard')({
  component: RouteComponent,
  validateSearch: (search) => ({
    filter: String(search?.filter ?? 'now')
  })
})

function RouteComponent() {
  const navigate = useNavigate()
  const {user} = useAuth()
  const {filter} = Route.useSearch()

  const { data } = useQuery({
    queryKey: ['dash-resume-penawaran', filter],
    queryFn: ({queryKey}) => useDashboardService.resume_penawaran({queryKey}),
    select: (res) => res.data
  })


  


  return (
    <div className="">
      <HeaderPage title='My Dashoard' />
      <div className="">
        <Card>
          <Card.Header>
            <div className="flex justify-end">
              <div className="">
                <div className="flex justify-end">
                  <PeriodeFilter onChange={(e) => navigate({search: (prev) => ({...prev, filter: Array.from(e)[0]})})} />
                </div>
                <Description>Lorem ipsum dolor sit amet consectetur.</Description>
              </div>
            </div>        
          </Card.Header>
          <Card.Content>
            <div className="flex flex-col gap-10">
              <div className="text-2xl">Hallo, {user?.full_name}</div>
              <div className="grid grid-cols-4 gap-10">
                <Card>
                  <Card.Header>
                    <Card.Title className='uppercase'>Penawaran</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="text-xl font-black">
                      {formatRupiah(data?.penawaran?.total)}
                    </div>
                    <Description>{data?.penawaran?.c_total} items</Description>
                  </Card.Content>
                </Card>
                <Card>
                  <Card.Header>
                    <Card.Title className='uppercase'>Proses Operasional</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="text-xl font-black">
                      {formatRupiah(data?.opsr?.total)}
                    </div>
                    <Description>{(data?.opsr?.c_total/data?.penawaran.c_total * 100).toFixed(2)} %</Description>
                  </Card.Content>
                </Card>
              </div>
              <Table>
                <Table.ScrollContainer>
                  <Table.Content>
                    <Table.Header>
                      <Table.Column isRowHeader>
                        Type Pekerjaan
                      </Table.Column>
                      <Table.Column>
                        Penawaran
                      </Table.Column>
                      <Table.Column>
                        Proses Operasioanl
                      </Table.Column>
                      <Table.Column>
                        Belum Proses
                      </Table.Column>
                      <Table.Column>
                        Percentase
                      </Table.Column>
                      
                    </Table.Header>
                    <Table.Body>
                      {
                        data?.results?.map((i, index) => {
                          return (
                            <Table.Row key={index}>
                            <Table.Cell>
                              {i.jenis_pekerjaan}
                            </Table.Cell>
                            <Table.Cell>{ formatRupiah(i.total)}</Table.Cell>
                            <Table.Cell> {formatRupiah(i.total_diproses)}</Table.Cell>
                            <Table.Cell>{formatRupiah(i.total - i.total_diproses)}</Table.Cell>
                            <Table.Cell>{i.percent.toFixed(2)} %</Table.Cell>
                          </Table.Row>
                          )
                        })
                      }
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}
