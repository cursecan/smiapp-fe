import { createFileRoute, useNavigate } from '@tanstack/react-router'
import HeaderPage from '../../components/HeaderPage'
import Chart from 'react-apexcharts'
import { useQuery } from '@tanstack/react-query';
import { useDashboardService } from '../../services/dashboad/dashboardService';
import { useMemo } from 'react';
import { Card, Description, Table } from '@heroui/react';
import { addMonths, format } from 'date-fns';
import { formatRupiah } from '../../utils/formatCurrency';
import { Label } from 'react-aria-components';


export const Route = createFileRoute('/_protected/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const today = new Date()

  const {data} = useQuery({
    queryKey: ['dashboard-penawaran'],
    queryFn: () => useDashboardService.resume_penawaran(),
    select: (res) => res.data
  })

  const {data: dataOprs} = useQuery({
    queryKey: ['dashboard-oprs'],
    queryFn: () => useDashboardService.resume_oprs(),
    select: (res) => res.data
  })

  const {data: dataAgens} = useQuery({
    queryKey: ['dashboard-agens'],
    queryFn: () => useDashboardService.resume_agens(),
    select: (res) => res.data
  })


  const chartData = useMemo(() => {
    return {
      // 
      series: [
        {
          type: 'column',
          name: 'Penawaran',
          data: data?.results?.map(i => i.total_penawaran) 
        },
        {
          type: 'column',
          name: 'Operasional',
          data: data?.results?.map(i => i.oprs)
        },
        
      ],
      options: {
        labels: data?.results?.map(i => i.month),
        xaxis: {
          type: 'datetime',
          // labels: {
          //   formatter: (v) => {
          //     return format(new Date(v), 'MMMM yyyy')
          //   }
          // }
        },
        yaxis: {
          labels: {
            formatter: (v) => {
              return `${(v/10**6).toFixed(2)} JT`
            }
          }
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        plotOptions: {
          bar: {
            columnWidth: '10%',
            borderRadius: 6,
            borderRadiusApplication: 'end',
            distributed: false,
          },
        },
      }
    }

    
  })
  
  


  return (
    <div className="">
      <HeaderPage title='My Dashoard' />
      <div className="flex flex-col gap-10 p-5">
        <Card>
          <Card.Header>
            <Card.Title>Realisasi Operasional vs Penawaran</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="">
              <Chart height={260} type='line' series={chartData.series} options={chartData.options} />
            </div>
          </Card.Content>
        </Card>
        
        <Card>
          <Card.Header>
            <Card.Title>Realisasi Operasional</Card.Title>
          </Card.Header>
          <Card.Content>
            <Table className=''>
              <Table.ScrollContainer>
                <Table.Content>
                  <Table.Header>
                    <Table.Column className={'w-64'} isRowHeader>
                      Jenis Pekerjaan
                    </Table.Column>
                    <Table.Column className={'text-center'}>
                      Bulan Berjalan
                    </Table.Column>
                    <Table.Column className={'text-center'}>
                      { format(addMonths(today, -1), 'MMM yyyy') } - Sekarang (2 Bulan)
                    </Table.Column>
                    <Table.Column className={'text-center'}>
                      { format(addMonths(today, -2), 'MMM yyyy') } - Sekarang (3 Bulan)
                    </Table.Column>
                    <Table.Column className={'text-center'}>
                      { format(addMonths(today, -5), 'MMM yyyy') } - Sekarang (6 Bulan)
                    </Table.Column>
                    <Table.Column className={'text-center'}>
                      { format(addMonths(today, -11), 'MMM yyyy') } - Sekarang (12 Bulan)
                    </Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {
                      dataOprs?.results?.map((i, index) => {
                        return (
                          <Table.Row key={index}>
                            <Table.Cell>
                              { i.j_pekerjaan }
                            </Table.Cell>
                            <Table.Cell className={'text-center'}>
                              { formatRupiah(i.total0) }
                            </Table.Cell>
                            <Table.Cell className={'text-center'}>
                              { formatRupiah(i.total1) }
                            </Table.Cell>
                            <Table.Cell className={'text-center'}>
                              { formatRupiah(i.total2) }
                            </Table.Cell>
                            <Table.Cell className={'text-center'}>
                              { formatRupiah(i.total3) }
                            </Table.Cell>
                            <Table.Cell className={'text-center'}>
                              { formatRupiah(i.total4) }
                            </Table.Cell>
                          </Table.Row>
                        )
                      })
                    }
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>

            <div className="mt-6 flex flex-col gap-3">
              <Label className='text-sm font-bold'>Progress Operasional</Label>
              <Table className=''>
                <Table.ScrollContainer>
                  <Table.Content>
                    <Table.Header>
                      <Table.Column  className={'w-64'} isRowHeader>
                        Agen User
                      </Table.Column>
                      <Table.Column className={'text-center'}>
                        Bulan Berjalan
                      </Table.Column>
                      <Table.Column className={'text-center'}>
                        { format(addMonths(today, -1), 'MMM yyyy') } - Sekarang (2 Bulan)
                      </Table.Column>
                      <Table.Column className={'text-center'}>
                        { format(addMonths(today, -2), 'MMM yyyy') } - Sekarang (3 Bulan)
                      </Table.Column>
                      <Table.Column className={'text-center'}>
                        { format(addMonths(today, -5), 'MMM yyyy') } - Sekarang (6 Bulan)
                      </Table.Column>
                      <Table.Column className={'text-center'}>
                        { format(addMonths(today, -11), 'MMM yyyy') } - Sekarang (12 Bulan)
                      </Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {
                        dataAgens?.results?.map((i, index) => {
                          return (
                            <Table.Row key={index}>
                              <Table.Cell>
                                { i.agen }
                              </Table.Cell>
                              <Table.Cell className={'text-center'}>
                                { formatRupiah(i.count_total0) }
                              </Table.Cell>
                              <Table.Cell className={'text-center'}>
                                { formatRupiah(i.count_total1) }
                              </Table.Cell>
                              <Table.Cell className={'text-center'}>
                                { formatRupiah(i.count_total2) }
                              </Table.Cell>
                              <Table.Cell className={'text-center'}>
                                { formatRupiah(i.count_total3) }
                              </Table.Cell>
                              <Table.Cell className={'text-center'}>
                                { formatRupiah(i.count_total4) }
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
          </Card.Content>
        </Card>
        
      </div>
    </div>
  )
}
