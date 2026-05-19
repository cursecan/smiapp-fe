import { Pagination } from "@heroui/react"
import { useNavigate } from "@tanstack/react-router"
import { generatePagination } from "../utils/paginationPages"


const PaginationTable = ({page, totalPage}) => {
    const navigate = useNavigate()


    return (
        <Pagination>
            <Pagination.Summary>
                Page {page} of {totalPage}
            </Pagination.Summary>
            <Pagination.Content>
                <Pagination.Item>
                    <Pagination.Previous isDisabled={page <= 1} onPress={() => navigate({search: (prev) => ({...prev, page: prev.page-1})})}>
                        <Pagination.PreviousIcon />
                        Prev
                    </Pagination.Previous>
                </Pagination.Item>
                {
                    generatePagination(page, totalPage).map((p, i) => {
                        return (
                            p === '...' ? (
                                <Pagination.Item key={`ellipsis-${i}`}>
                                    <Pagination.Ellipsis />
                                </Pagination.Item>
                            ) : (
                                <Pagination.Item key={p}>
                                    <Pagination.Link isActive={p === page} onPress={() => navigate({search: (prev) => ({...prev, page: p})})}>{p}</Pagination.Link>
                                </Pagination.Item>
                            )
                        )
                    })
                }
                <Pagination.Item>
                    <Pagination.Next isDisabled={page >= totalPage} onPress={() => navigate({search: (prev) => ({...prev, page: prev.page+1})})}>
                        Next
                        <Pagination.NextIcon />
                    </Pagination.Next>
                </Pagination.Item>
            </Pagination.Content>
        </Pagination>
    )
}

export default PaginationTable