import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useParams } from '@tanstack/react-router'
import { useOprasionalService } from '../../../../services/oprasional/oprasionalService'
import HeaderPage from '../../../../components/HeaderPage'
import { Breadcrumbs, Card, Separator, Surface } from '@heroui/react'
import { House, Rocket } from '@gravity-ui/icons'
import KegiatanList from '../-components/oprasional/KegiatanList'

export const Route = createFileRoute('/_protected/oprasional/oprasional/$id')({
  component: RouteComponent,
})

function RouteComponent() {
    const { id } = useParams({from: '/_protected/oprasional/oprasional/$id'})

    const { data, isLoading } = useQuery({
        queryKey: ['oprasional', id],
        queryFn: async () => {
            return await useOprasionalService.detail(id)
        },
        select: (data) => data.data
    })


    if (isLoading) {
        return <div className="">Loading</div>
    }

  return (
    <div className="">
        <HeaderPage
            icon={<Rocket className='size-8' />}
        >
            <Breadcrumbs>
                <Breadcrumbs.Item>
                    <House />
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>Oprasional</Breadcrumbs.Item>
                <Breadcrumbs.Item>Detail</Breadcrumbs.Item>
            </Breadcrumbs>
        </HeaderPage>

        <div className="mt-6">
            <Card>
                <Card.Content>
                    <div className="text-lg">
                        { data?.penawaran.nama_project }
                    </div>
                </Card.Content>
            </Card>

            <div className="mt-6">
                <KegiatanList data={data} />
            </div>
        </div>
    </div>
  )
}