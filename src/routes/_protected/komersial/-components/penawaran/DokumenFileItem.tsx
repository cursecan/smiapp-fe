import {Link, Table } from "@heroui/react"
import SelectComponent from "../../../../../components/input/SelectComponent"
import { useTypeFilePenawaran } from "../../../../../constans"
import { useMutation } from "@tanstack/react-query"
import { useDokumenPenawaranService } from "../../../../../services/komersial/dokumenPenawaranService"
import { ArrowUpRightFromSquare } from "@gravity-ui/icons"


const DokumenFileItem = ({item, canEdit}) => {
    const update_mutate = useMutation({
        mutationFn: async (payload) => {
            return await useDokumenPenawaranService.update(item.id, payload)
        },
    })

    const handleChange = (e) => {
        update_mutate.mutate({...item, doc_type:e})
    }


  return (
    <Table.Row>
        <Table.Cell>{item.index+1}</Table.Cell>
        <Table.Cell>
        {item.filename}
        </Table.Cell>
        <Table.Cell>
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