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
        select: (data) => data.data.filter(i => !i.is_header)
    }) 

    const { data:catatan, isLoading:loadingCatatan} = useQuery({
        queryKey: ['catatan-list'],
        queryFn: async () => {
            return await useOprasionalService.catatan(data?.id)
        },
        select: (data) => data.data
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
            <Card.Title>Check List Pekerjaan</Card.Title>
        </Card.Header>
        <Card.Content>
            <Table>
                <Table.ScrollContainer>
                    <Table.Content>
                        <Table.Header>
                            <Table.Column isRowHeader className={'w-0 truncate'}>No</Table.Column>
                            <Table.Column>Pekerjaan</Table.Column>
                            <Table.Column className={'w-50 truncate'}>Progress (%)</Table.Column>
                            <Table.Column className={'truncate w-0'}>Selesai?</Table.Column>
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