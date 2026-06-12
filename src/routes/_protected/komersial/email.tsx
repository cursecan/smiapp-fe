import { Card, Label, SearchField, Surface, Switch, Table } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEmailService } from '../../../services/email.service'
import ItemEmailList from './-components/ItemEmailList'
import HeaderPage from '../../../components/HeaderPage'
import PaginationTable from '../../../components/PaginationTable'

export const Route = createFileRoute('/_protected/komersial/email')({
  component: RouteComponent,
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
    q: String(search.q ?? ''),
    all: Boolean(search.all ?? false)
  })
})

function RouteComponent() {
    const navigate = useNavigate()
    const {page, q, all} = Route.useSearch()
    
    const changeSearch = (e) => {
        setTimeout(() => {
            navigate({
                search: (prev) => ({...prev, q: e.target.value, page: 1})
            })
        }, 800);
    }

    const { data } = useQuery({
        queryKey: ['email-list', page, q, all],
        queryFn: async ({queryKey}) => {
            return await useEmailService.getList({queryKey})
        },
        select: (data) => data.data
    })
    

    const totalPage = Math.ceil(data?.count / 10)

    const onChangeSholAll = (e) => {
        navigate({search: (prev) => ({...prev, all: e}) })
        // setShowAll(e)
    }

    return (
        <Surface className='px-6 mt-1'>
            <HeaderPage title={'Email Quotation'} />
            <Card>
                <Card.Header>
                    <Card.Title className='text-xl'>Mail Inbox</Card.Title>
                    <div className="mt-4 flex items-center gap-5">
                        <SearchField className={'w-100'}>
                            <SearchField.Group>
                                <SearchField.SearchIcon />
                                <SearchField.Input onChange={changeSearch} placeholder='Search...' className={'w-90'} />
                                <SearchField.ClearButton onPress={() => navigate({search: (prev) => ({...prev, q: undefined})})} />
                            </SearchField.Group>
                        </SearchField>
                        <Switch isSelected={all} onChange={onChangeSholAll}>
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                            <Switch.Content>
                                <Label>Show all</Label>
                            </Switch.Content>
                        </Switch>
                    </div>
                </Card.Header>
                <Card.Content>
                    <div className="">
                        <Table>
                            <Table.ScrollContainer>
                                <Table.Content>
                                    <Table.Header>
                                        <Table.Column isRowHeader>
                                            Email
                                        </Table.Column>
                                        <Table.Column>
                                            From
                                        </Table.Column>
                                        <Table.Column>
                                            
                                        </Table.Column>
                                    </Table.Header>
                                    <Table.Body>
                                        {
                                            data?.results.map(i => {
                                                return (
                                                    <ItemEmailList item={i} key={i.id} />
                                                )
                                            })
                                        }
                                    </Table.Body>
                                </Table.Content>
                            </Table.ScrollContainer>
                            {
                                data?.count > 0 && (
                                    <Table.Footer>
                                        <PaginationTable page={page} totalPage={totalPage} />
                                    </Table.Footer>

                                )
                            }
                        </Table>
                    </div>
                </Card.Content>
            </Card>
        </Surface>
    )
}