import {  useQuery } from "@tanstack/react-query"
import {usePenawaranService } from "../../../../../services/penawaran.service"
import {  Card, Table } from "@heroui/react"
import { useOprasionalService } from "../../../../../services/oprasional/oprasionalService"
import ItemKegiatan from "./ItemKegiatan"

const KegiatanList = ({data}) => {
    const { data:kegiatan, isLoading:loadingKegiatan } = useQuery({
        queryKey: ['kegiatatan-list'],
        queryFn: async () => {
            return await usePenawaranService.items(data?.penawaran.id)
        },
        select: (data) => data.data.filter(i => !i.is_header),
        enabled: !!data?.penawaran.id
    }) 

    const { data:catatan, isLoading:loadingCatatan} = useQuery({
        queryKey: ['catatan-list'],
        queryFn: async () => {
            return await useOprasionalService.catatan(data?.id)
        },
        select: (data) => data.data,
        enabled: !!data?.id
    }) 

    if (loadingKegiatan || loadingCatatan) {
        return <div className="">Loading...</div>
    }

    const kegiatan_ops = kegiatan.map(i => {
        const my_catatan = catatan.filter(m=> m.item_penawaran===i.id)
        return {...i, catatan: my_catatan}
    })


  return (
    <Card>
        <Card.Header>
            <Card.Title>Progress Pekerjaan</Card.Title>
        </Card.Header>
        <Card.Content>
            <Table>
                <Table.ScrollContainer>
                    <Table.Content>
                        <Table.Header>
                            {/* <Table.Column isRowHeader className={'w-0 truncate'}>No</Table.Column> */}
                            <Table.Column isRowHeader className={'truncate'}>Progress</Table.Column>
                            <Table.Column>Barang / Jasa</Table.Column>
                            <Table.Column className={'truncate w-0'}></Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {
                                kegiatan_ops?.map((i, index) => {
                                    return (
                                        <ItemKegiatan item={{...i, index}} key={index} />
                                    )
                                })
                            }

                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
        </Card.Content>
    </Card>
  )
}

export default KegiatanList