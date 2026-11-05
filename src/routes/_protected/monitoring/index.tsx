import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useOprasionalService } from '../../../services/oprasional/oprasionalService'
import { SearchField, Surface, Table } from '@heroui/react'
import ItemList from './-components/ItemList'
import HeaderPage from '../../../components/HeaderPage'
import PaginationTable from '../../../components/PaginationTable'
import MonitoringCard from './-components/MonitoringCard'
import { getJenisPekerjaan } from '../../../components/useSchema'
import JenisPekerjaanFilter from '../../../components/JenisPekerjaanFilter'
import ExportMonitoringModal from './-components/ExportMonitoringModal'

export const Route = createFileRoute('/_protected/monitoring/')({
  component: RouteComponent,
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
    q: String(search.q ?? ''),
    nospk: String(search.nospk ?? ''),
    jobtype: String(search.jobtype ?? '')
  })
})

function RouteComponent() {
  const navigate = useNavigate()
  const filter_pekerjaan = getJenisPekerjaan()
  const {page, q, nospk, jobtype} = Route.useSearch()

  const {data} = useQuery({
    queryKey: ['monitoring', page, q, nospk, jobtype],
    queryFn: ({queryKey}) => useOprasionalService.minitoring({queryKey}),
    select: (res) => res.data
  })

  const changeSearch =(e) => {
    setTimeout(() => {
      navigate({search: (prev) => ({...prev, q: e.target.value, page:1, nospk:''})})
    }, 800);
  }

  const totalPages = Math.ceil(data?.count/10)



  return (
    <Surface className='px-6 my-1'>
      <HeaderPage title='Monitoring' />

      <div className="mb-6">
        <MonitoringCard hideFirst />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2">
          <SearchField className={'w-100'}>
              <SearchField.Group>
                  <SearchField.SearchIcon />
                  <SearchField.Input onChange={changeSearch} placeholder='Search...' className={'w-90'} />
                  <SearchField.ClearButton onPress={() => navigate({search: (prev) => ({...prev, q: undefined})})} />
              </SearchField.Group>
          </SearchField>
          <JenisPekerjaanFilter data={filter_pekerjaan} onChange={(e) => navigate({search: (prev) => ({...prev, jobtype: e})})} />
        </div>
        <div className="flex items-center">
          <ExportMonitoringModal />
        </div>
      </div>
      <div className="mt-6">
        <Table>
          <Table.ScrollContainer>
            <Table.Content>
              <Table.Header>
                <Table.Column isRowHeader>
                  Penawaran
                </Table.Column>
                <Table.Column>
                  Nilai Penawaran
                </Table.Column>
                <Table.Column>
                  Total Pengeluaran / Expense
                </Table.Column>
                <Table.Column>
                  Total Invoice
                </Table.Column>
                <Table.Column>
                  Status
                </Table.Column>
              </Table.Header>
              <Table.Body>
                {
                  data?.results?.map(item => {
                    return (
                    <ItemList item={item} key={item.id} />

                    )
                  })
                }
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
          {
              data?.count > 0 && (
                <Table.Footer>
                  <PaginationTable totalPage={totalPages} page={page}  />
                </Table.Footer>

              )
          }
        </Table>
      </div>

    </Surface>
  )
}
