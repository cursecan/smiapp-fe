import { Button, Chip, Pagination, SearchField, Table } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEmailService } from "../../../services/email.service"
import {useFormatDate } from "../../../utils/dateFormat"
import { useState } from 'react'
import ItemEmailList from './-components/ItemEmailList'

export const Route = createFileRoute('/_protected/komersial/email')({
  component: RouteComponent,
})

function RouteComponent() {
    const [page, setPage] = useState(0)
    const limit = 10
    const [search, setSearch] = useState()
    
    const changeSearch = (e) => {
        setTimeout(() => {
            setPage(0)
            setSearch(e.target.value)
        }, 800);
    }

    const { data } = useQuery({
        queryKey: ['email-list', page, search],
        queryFn: async ({queryKey}) => useEmailService.getList({limit, page: queryKey[1], q: queryKey[2]}),
        select: (data: any) => data.data
    })

    console.log(data);
    

    const totalPage = Math.ceil(data?.count / limit)

    return (
        <div className="py-4 px-4">
            <div className="text-xl font-semibold">Permintaan Pekerjaan by Email</div>

            {/* content */}
            <div className="mt-10 space-y-6">
                <div className="flex">
                    <SearchField>
                        <SearchField.Group>
                            <SearchField.SearchIcon />
                            <SearchField.Input onChange={changeSearch} placeholder='Search...' className={'w-90'} />
                            <SearchField.ClearButton onPress={() => setSearch('')} />
                        </SearchField.Group>
                    </SearchField>

                </div>
                <Table variant='secondary'>
                    <Table.ScrollContainer>
                        <Table.Content>
                            <Table.Header>
                                <Table.Column isRowHeader className={'truncate'}>
                                    Receive Date
                                </Table.Column>
                                <Table.Column>
                                    Sender
                                </Table.Column>
                                <Table.Column>
                                    Subject
                                </Table.Column>
                                <Table.Column>
                                    Penawaran
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
                                Page {page+1} of {totalPage}
                            </Pagination.Summary>
                            <Pagination.Content>
                                <Pagination.Item>
                                    <Pagination.Previous isDisabled={page <= 0} onPress={() => setPage(state => state-1)}>
                                        <Pagination.PreviousIcon />
                                        Prev
                                    </Pagination.Previous>
                                </Pagination.Item>
                                <Pagination.Item>
                                    <Pagination.Next isDisabled={page >= totalPage - 1} onPress={() => {setPage(state => state+1)}}>
                                        Next
                                        <Pagination.NextIcon />
                                    </Pagination.Next>
                                </Pagination.Item>
                            </Pagination.Content>
                        </Pagination>
                    </Table.Footer>
                </Table>
            </div>
        </div>
    )
}