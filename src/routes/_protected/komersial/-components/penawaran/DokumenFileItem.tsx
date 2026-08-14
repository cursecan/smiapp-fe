import {Link, Table } from "@heroui/react"
import SelectComponent from "../../../../../components/input/SelectComponent"
import { useTypeFilePenawaran } from "../../../../../constans"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useDokumenPenawaranService } from "../../../../../services/komersial/dokumenPenawaranService"
import { ArrowUpRightFromSquare } from "@gravity-ui/icons"
import { useState } from "react"


const DokumenFileItem = ({item:item0, canEdit}) => {
    // const qc = useQueryClient()
    const [item, setItem] = useState({...item0})

    const update_mutate = useMutation({
        mutationFn: async (payload) => {
            return await useDokumenPenawaranService.update(item.id, payload)
        },
        onSuccess: (res) => {
            // qc.invalidateQueries({queryKey: ['doks-list-penawaran']})
            setItem({...item, doc_type:res.data.doc_type})
        }
    })

    const handleChange = (e) => {
        update_mutate.mutate({...item, doc_type:e})
    }


  return (
    <Table.Row>
        <Table.Cell className={item.doc_type !== 'UN' && 'bg-success/10'}>{item.index+1}</Table.Cell>
        <Table.Cell className={item.doc_type !== 'UN' && 'bg-success/10'}>
            {item.filename}
        </Table.Cell>
        <Table.Cell className={item.doc_type !== 'UN' && 'bg-success/10'}>
            <div className="">
                <SelectComponent isDisabled={!canEdit} value={item.doc_type} data={useTypeFilePenawaran} onChange={handleChange} />
            </div>
        </Table.Cell>
        <Table.Cell className={'w-0 truncate'}>
            {/* <CloseButton /> */}
            <Link target="_blank" href={item.filepath}>
                <ArrowUpRightFromSquare />
            </Link>
        </Table.Cell>
    </Table.Row>
  )
}

export default DokumenFileItem