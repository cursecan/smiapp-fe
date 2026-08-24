import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import HeaderPage from '../../components/HeaderPage'
import Chart from 'react-apexcharts'
import { useQuery } from '@tanstack/react-query';
import { useDashboardService } from '../../services/dashboad/dashboardService';
import { useMemo } from 'react';
import { Card, Description, Label, Surface, Table } from '@heroui/react';
import { addMonths, format } from 'date-fns';
import { formatRupiah } from '../../utils/formatCurrency';
import { Link as LinkHero } from '@heroui/react';
import JenisPekerjaanFilter from '../../components/JenisPekerjaanFilter';
import { getJenisPekerjaan } from '../../components/useSchema';



export const Route = createFileRoute('/_protected/dashboard')({
  component: RouteComponent,
   validateSearch: (search) => ({
    jobtype: String(search.jobtype ?? '')
  })
})

function RouteComponent() {
  const navigate = useNavigate()
  const today = new Date()
  const {jobtype} = Route.useSearch()

  const filter_pekerjaan = getJenisPekerjaan()

  const {data} = useQuery({
    queryKey: ['dashboard-penawaran'],
    queryFn: () => useDashboardService.resume_penawaran(),
    select: (res) => res.data
  })

  const {data: divisi_report} = useQuery({
    queryKey: ['divisi-report', jobtype],
    queryFn: () => useDashboardService.divisi_report({jobtype}),
    select: (res) => {
      const dt = res.data
      const dt_oprsi = dt?.oprs1.map(i => (!i.group ? {...i, group: 'Other..'} : i))
      return {...dt, oprs1: dt_oprsi}
    }
  })
  

  const {data: monitoring} = useQuery({
    queryKey: ['dashboard-monitoring'],
    queryFn: () => useDashboardService.monitoring(),
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
              return `${(v/10**9).toFixed(2)} M`
            }
          }
        },
        // stroke: {
        //   curve: 'smooth',
        //   width: 2
        // },
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


  const chartData2 = useMemo(() => {
    return {
      // 
      series: [
        {
          type: 'column',
          name: 'Monitoring',
          data: divisi_report?.oprs0?.map(i => i.item_count) 
        }
        
      ],
      options: {
        labels: divisi_report?.oprs0?.map(i => i.month),
        dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
              const value = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex];

              return value > 0 ? value : '';
            }
        },
        xaxis: {
          type: 'datetime',
          // labels: {
          //   formatter: (v) => {
          //     return format(new Date(v), 'MMMM yyyy')
          //   }
          // }
        },
        // yaxis: {
        //   labels: {
        //     formatter: (v) => {
        //       return `${(v/10**9).toFixed(2)} M`
        //     }
        //   }
        // },
        // stroke: {
        //   curve: 'smooth',
        //   width: 2
        // },
        // plotOptions: {
        //   bar: {
        //     columnWidth: '10%',
        //     borderRadius: 6,
        //     borderRadiusApplication: 'end',
        //     distributed: false,
        //   },
        // },
      }
    }

    
  })


  const groups = [
      ...new Set(
          divisi_report?.oprs1.map(item => item.group ?? "Other..")
      )
  ];

  const timeDuration = [
    ...new Set(
      divisi_report?.oprs1.map(item => item.month)
    )
  ]
  

  const seriesGroup = groups?.map(i => {
    return {
      name: i,
      data: divisi_report?.oprs1?.filter(e => e.group===i).map(e => e.item_count)
    }
    
  })


  const chartData3 = useMemo(() => {
    return {
      // 
      series: seriesGroup,
      options: {
        labels: timeDuration,
        dataLabels: {
            enabled: true,
            formatter: function (val, opts) {
              const value = opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex];

              return value > 0 ? value : '';
            }
        },

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
              return v
            }
          }
        },
        stroke: {
          curve: 'smooth',
          width: 2
        },
        // plotOptions: {
        //   bar: {
        //     columnWidth: '10%',
        //     borderRadius: 6,
        //     borderRadiusApplication: 'end',
        //     distributed: false,
        //   },
        // },
      }
    }

    
  })
  
  


  return (
    <div className="">
      <HeaderPage title='My Dashoard' />
      <div className="flex flex-col gap-10 p-5">
        <Card>
          {/* <Card.Header>
            <Card.Title>Realisasi Project Per Bulan</Card.Title>
          </Card.Header> */}
          <Card.Content>
            <JenisPekerjaanFilter data={filter_pekerjaan} onChange={(e) => navigate({search: (prev) => ({...prev, jobtype: e})})} />
            <div className="grid grid-cols-2 gap-3">
              <Chart height={260} series={chartData2.series} options={chartData2.options} />
              <Chart height={260} series={chartData3.series} options={chartData3.options} />
            </div>
          </Card.Content>
        </Card>
        

        <div className="">
          <Card>
            <Card.Header>
              <Card.Title>Monitoring Unclosed</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="grid grid-cols-5 gap-3">
                <Surface variant='secondary' className='rounded-2xl p-3'>
                  <Description className="">Penawaran</Description>
                  <div className="">
                    <Link to={'/komersial/penawaran?filter=inisiasi'}>
                      <div className="link gap-2">
                        <p>{monitoring?.penawaran.un_close}</p>
                        <LinkHero.Icon className='text-accent' />
                      </div>
                    </Link>
                  </div>
                </Surface>
                <Surface variant='secondary' className='rounded-2xl p-3'>
                  <Description className="">Tidak Ada SPK</Description>
                  <div className="">
                    <Link to={'/komersial/penawaran?nospk=1'}>
                      <div className="link gap-2">
                        <p>{monitoring?.penawaran.no_spk_count}</p>
                        <LinkHero.Icon className='text-accent' />
                      </div>
                    </Link>
                  </div>
                </Surface>
                <Surface variant='secondary' className='rounded-2xl p-3'>
                  <Description className="">Progress Oprasional</Description>
                  <div className="">
                    <Link to={'/komersial/penawaran'}>
                      <div className="link gap-2">
                        <p>{monitoring?.oprasional.un_close}</p>
                        <LinkHero.Icon className='text-accent' />
                      </div>
                    </Link>
                  </div>
                </Surface>
                <Surface variant='secondary' className='rounded-2xl p-3'>
                  <Description className="">Blm Create Casbon</Description>
                  <div className="">
                    <Link to={'/komersial/penawaran'}>
                      <div className="link gap-2">
                        <p>{monitoring?.oprasional.no_casbon}</p>
                        <LinkHero.Icon className='text-accent' />
                      </div>
                    </Link>
                  </div>
                </Surface>
                <Surface variant='secondary' className='rounded-2xl p-3'>
                  <Description className="">Blm Invoice</Description>
                  <div className="">
                    <Link to={'/komersial/penawaran'}>
                      <div className="link gap-2">
                        <p>{monitoring?.oprasional.un_invoice}</p>
                        <LinkHero.Icon className='text-accent' />
                      </div>
                    </Link>
                  </div>
                </Surface>
              </div>
            </Card.Content>
          </Card>
        </div>
        
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
