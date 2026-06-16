import {  useQuery } from "@tanstack/react-query"
import {usePenawaranService } from "../../../../../services/penawaran.service"
import { Table } from "@heroui/react"
import ItemKegiatan from "./ItemKegiatan"
import UploadDocProgressModal from "./progressCatatan/UploadDocProgressModal"
import { useOprasionalService } from "../../../../../services/oprasional/oprasionalService"

const KegiatanList = ({data}) => {
    const { data:kegiatan, isLoading:loadingKegiatan } = useQuery({
        queryKey: ['kegiatatan-list'],
        queryFn: async () => {
            return await usePenawaranService.items(data?.penawaran.id)
        },
        select: (data) => data.data.filter(i => !i.is_header),
        enabled: !!data?.penawaran.id
    }) 
    const { data:progress, isLoading:loadingProgress } = useQuery({
        queryKey: ['progress-list'],
        queryFn: async () => {
            return await useOprasionalService.progress(data?.id)
        },
        select: (data) => data.data,
        enabled: !!data?.id
    })
 
    

    if (loadingKegiatan || loadingProgress) {
        return <div className="">Loading...</div>
    }


    const progress_kegiatan = kegiatan.map(k => {
        const item = {...k, docs: []}
        progress.forEach(p => {
            if (p.item_penawaran.includes(k.id)) {
                item.docs.push({filename: p.filename, filepath: p.filepath, ket: p.keterangan})
            }
        }) 

        return item
    })

  return (
    <div className="">
        <div className="mb-4 flex justify-end">
            <UploadDocProgressModal ops={data?.id} data={kegiatan} />

        </div>
        <Table className="font-mono">
            <Table.ScrollContainer>
                <Table.Content>
                    <Table.Header>
                        <Table.Column isRowHeader >
                            Progress
                        </Table.Column>
                        <Table.Column>Pekerjaan</Table.Column>
                        <Table.Column>Qty</Table.Column>
                        <Table.Column>Amount</Table.Column>
                        <Table.Column>More</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {
                            progress_kegiatan?.map((i, index) => {
                                return (
                                    <ItemKegiatan key={index} item={{...i, index:index}} />
                                )
                            })
                        }
                    </Table.Body>
                </Table.Content>
            </Table.ScrollContainer>
        </Table>
        
    </div>
  )
}

export default KegiatanList