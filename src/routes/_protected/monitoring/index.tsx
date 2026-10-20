import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useOprasionalService } from '../../../services/oprasional/oprasionalService'
import { Description, Label, SearchField, Surface, Table } from '@heroui/react'
import { formatRupiah } from '../../../utils/formatCurrency'
import ItemList from './-components/ItemList'
import HeaderPage from '../../../components/HeaderPage'
import PaginationTable from '../../../components/PaginationTable'

export const Route = createFileRoute('/_protected/monitoring/')({
  component: RouteComponent,
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
    q: String(search.q ?? ''),
  })
})

function RouteComponent() {
  const navigate = useNavigate()
  const {page, q} = Route.useSearch()

  const {data} = useQuery({
    queryKey: ['monitoring', page, q],
    queryFn: ({queryKey}) => useOprasionalService.minitoring({queryKey}),
    select: (res) => res.data
  })

  const changeSearch =(e) => {
    setTimeout(() => {
      navigate({search: (prev) => ({...prev, q: e.target.value, page:1})})
    }, 800);
  }

  const totalPages = Math.ceil(data?.count/10)



  return (
    <Surface className='px-6 my-1'>
      <HeaderPage title='Monitoring Pekerjaan' />

      <div className="">
        <SearchField className={'w-100'}>
            <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input onChange={changeSearch} placeholder='Search...' className={'w-90'} />
                <SearchField.ClearButton onPress={() => navigate({search: (prev) => ({...prev, q: undefined})})} />
            </SearchField.Group>
        </SearchField>
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
