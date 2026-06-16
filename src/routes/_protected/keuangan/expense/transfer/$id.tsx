import { createFileRoute, useParams } from '@tanstack/react-router'
import HeaderPage from '../../../../../components/HeaderPage'
import { Breadcrumbs, Card, Description, Label, Surface } from '@heroui/react'
import { useQuery } from '@tanstack/react-query'
import { useCasbonService } from '../../../../../services/oprasional/casbonService'

export const Route = createFileRoute(
  '/_protected/keuangan/expense/transfer/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
    const { id } = useParams({from: '/_protected/keuangan/expense/transfer/$id'})

    const {data, isLoading} = useQuery({
        queryKey: ['casbon-detail', id],
        queryFn: () => useCasbonService.detail(id),
        select: (res) => res.data
    })

    if (isLoading) {
        return <div className="">Loading...</div>
    }

    console.log(data);
    
        
  return (
    <div className="">
        <HeaderPage 
            breadchrumb={
                <Breadcrumbs>
                    <Breadcrumbs.Item>Transfer</Breadcrumbs.Item>
                    <Breadcrumbs.Item>Casbon</Breadcrumbs.Item>
                    <Breadcrumbs.Item>FOFIN.{data?.nomor}</Breadcrumbs.Item>
                </Breadcrumbs>
            }
        />
        <div className="flex mt-6">
            <div className="max-w-3xl w-full">
                <Surface className='px-4'>
                    <div className="flex flex-col">
                        <Description>Nama Projek / Pekerjaan</Description>
                        <Label>
                            {data?.nama_project}
                        </Label>
                    </div>
                </Surface>
            </div>
        </div>
    </div>
  )
}
