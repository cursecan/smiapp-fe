import { Card, Pagination, SearchField, Table } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEmailService } from "../../../services/email.service"
import { useState } from 'react'
import ItemEmailList from './-components/ItemEmailList'
import HeaderPage from '../../../components/HeaderPage'

export const Route = createFileRoute('/_protected/komersial/email')({
  component: RouteComponent,
})

function RouteComponent() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState()
    
    const changeSearch = (e) => {
        setTimeout(() => {
            setPage(1)
            setSearch(e.target.value)
        }, 800);
    }

    const { data } = useQuery({
        queryKey: ['email-list', page, search],
        queryFn: async ({queryKey}) => {
            return await useEmailService.getList({queryKey})
        },
        select: (data: any) => data.data
    })
    

    const totalPage = Math.ceil(data?.count / 10)

    return (
        <div className="mt-10">
            <HeaderPage title={'Email Quotation'} />
            <Card className='mt-6'>
                <Card.Header>
                    <Card.Title className='text-xl font-bold'>Mail Inbox</Card.Title>
                    <div className="mt-7">
                        <SearchField className={'w-100'}>
                            <SearchField.Group>
                                <SearchField.SearchIcon />
                                <SearchField.Input onChange={changeSearch} placeholder='Search...' className={'w-90'} />
                                <SearchField.ClearButton onPress={() => setSearch('')} />
                            </SearchField.Group>
                        </SearchField>
                    </div>
                </Card.Header>
                <Card.Content>
                    <div className="">
                        <Table>
                            <Table.ScrollContainer>
                                <Table.Content>
                                    <Table.Header>
                                        <Table.Column isRowHeader>
                                            Subject
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
                            <Table.Footer>
                                <Pagination>
                                    <Pagination.Summary>
                                        Page {page} of {totalPage}
                                    </Pagination.Summary>
                                    <Pagination.Content>
                                        <Pagination.Item>
                                            <Pagination.Previous isDisabled={page <= 1} onPress={() => setPage(state => state-1)}>
                                                <Pagination.PreviousIcon />
                                                Prev
                                            </Pagination.Previous>
                                        </Pagination.Item>
                                        <Pagination.Item>
                                            <Pagination.Next isDisabled={page >= totalPage} onPress={() => {setPage(state => state+1)}}>
                                                Next
                                                <Pagination.NextIcon />
                                            </Pagination.Next>
                                        </Pagination.Item>
                                    </Pagination.Content>
                                </Pagination>
                            </Table.Footer>
                        </Table>
                    </div>
                </Card.Content>
            </Card>
        </div>
    )
}