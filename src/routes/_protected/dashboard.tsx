import { createFileRoute, useNavigate } from '@tanstack/react-router'
import HeaderPage from '../../components/HeaderPage'
import { Card, Description, Label, Surface, Table } from '@heroui/react'
import PeriodeFilter from '../../components/PeriodeFilter'
import { useQuery } from '@tanstack/react-query'
import { useDashboardService } from '../../services/dashboad/dashboardService'
import { formatRupiah } from '../../utils/formatCurrency'
import { useAuth } from '../../auth/AuthProvider'
import { usePegawayService } from '../../services/masterdata/pegawayService'
import SelectComponent from '../../components/input/SelectComponent'
import { useMemo } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Colors } from "chart.js";
import {Doughnut} from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend, Colors);

export const Route = createFileRoute('/_protected/dashboard')({
  component: RouteComponent,
  validateSearch: (search) => ({
    period: Number(search?.period ?? 0) 
  })
})

function RouteComponent() {
  const navigate = useNavigate()
  const {user} = useAuth()
  const {period} = Route.useSearch()

  const dataOptions = [
    {id: 0, label: 'Bulan Berjalan'},
    {id: 1, label: 'Bulan Lalu'},
    {id: 2, label: '3 Bulan'},
    {id: 3, label: '6 Bulan'}, 
    {id: 4, label: 'Tahunsa'},
  ]

  const { data } = useQuery({
    queryKey: ['dash-resume-penawaran', period],
    queryFn: ({queryKey}) => useDashboardService.resume_penawaran({queryKey}),
    select: (res) => res.data
  })

  console.log(data);
  


  const donDataset = useMemo(() => {
    return {
      labels: data?.results.map(i => i.jenis_pekerjaan) || [],
      datasets: [
        {
          label: '# of Votes',
          data: data?.results.map(i => i.total) || []
        }
      ]
    }
  })

  // const { data: agens } = useQuery({
  //   queryKey: ['agen-list'],
  //   queryFn: () => {
  //     return usePegawayService.agens()
  //   },
  //   select: (res) => res.data
  // })


  // const agen_options = useMemo(() => {
  //   const a = agens?.map(i => ({id: i.id, label: i.user.full_name})) || []
  //   return [{id: '', label: 'Pilih Semua Agen'}, ...a]
  // })
  
  


  return (
    <div className="">
      <HeaderPage title='My Dashoard' />
      <div className="flex flex-col gap-10">
        <Card>
          <Card.Header>
            <div className="flex justify-end">
              <div className="">
                <div className="flex justify-end">
                  <div className="lex flex-col">
                    <div className="flex justify-end">
                      <SelectComponent value={period} data={dataOptions} onChange={(e) => navigate({search: (prev) => ({...prev, period: e})})} />
                    </div>
                    {/* <Description>Periode Pengamatan</Description> */}
                  </div>
                </div>
              </div>
            </div>        
          </Card.Header>
          <Card.Content>
            <div className="flex flex-col gap-10">
              <div className="text-2xl">Hallo, {user?.full_name}</div>
              <div className="grid grid-cols-5 gap-10">
                <Card>
                  <Card.Header>
                    <Card.Title className='uppercase'>Penawaran</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="text-xl font-black">
                      {formatRupiah(data?.penawaran?.total)}
                    </div>
                    <Description>{data?.penawaran?.c_total} penawaran</Description>
                  </Card.Content>
                </Card>
                <Card>
                  <Card.Header>
                    <Card.Title className='uppercase'>Operasional</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <div className="text-xl font-black">
                      {formatRupiah(data?.opsr?.total)}
                    </div>
                    <Description>{(data?.opsr?.c_total/data?.penawaran.c_total * 100).toFixed(2)} % proses oprasional</Description>
                  </Card.Content>
                </Card>
              </div>
              {/* <Table>
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
              </Table> */}
            </div>
          </Card.Content>
        </Card>
        
        {/* Penawaran */}
        <div className="flex gap-10 p-4">
          <div className="w-1/4">
              <Doughnut data={donDataset} />
          </div>
          <div className="flex-1">
            <Table>
              <Table.ScrollContainer>
                <Table.Content>
                  <Table.Header>
                    <Table.Column>Jenis Pekerjaan</Table.Column>
                    <Table.Column>Penawaran</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {
                      data?.results.map(i => {
                        return (
                          <Table.Row>
                            <Table.Cell>{i.jenis_pekerjaan}</Table.Cell>
                            <Table.Cell>{formatRupiah(i.total)}</Table.Cell>
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
      </div>
    </div>
  )
}
