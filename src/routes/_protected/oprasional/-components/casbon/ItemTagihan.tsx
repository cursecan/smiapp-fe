import { File } from "@gravity-ui/icons"
import { CloseButton, Description, Label, Table } from "@heroui/react"
import { formatSimpleDate2 } from "../../../../../utils/dateFormat"
import { formatRupiah } from "../../../../../utils/formatCurrency"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTagihanCabonService } from "../../../../../services/oprasional/tagihanCasbonService"
import { useToast } from "../../../../../lib/useToast"
import UpdateTagihanModal from "./UpdateTagihanModal"

const ItemTagihan = ({item, canEdit=false}) => {
    const qc = useQueryClient()
    const toast = useToast()

    const dropMutatio = useMutation({
        mutationFn: (id) => useTagihanCabonService.drop(id),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['tagihan-list']})
        },
        onError: (err) => {
            toast.danger({message: 'Failed', description: err.message})
        }
    })

    const onDropHandle = (id) => {
        dropMutatio.mutate(id)
    }

    return (
        <Table.Row key={item.id}>
            <Table.Cell>
                <div className="flex flex-col">
                    <Label>{item.catatan || 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur, officia.'}</Label>
                    <Description>NO INV. {item.nomor_tagihan}</Description>
                    <div className="flex mt-3">
                        <a title={item.file_name} href={item.file_path} target="_blank">
                            <CloseButton className={' bg-amber-400 text-white'}>
                                <File />
                            </CloseButton>
                        </a>
                    </div>
                </div>
            </Table.Cell>
            <Table.Cell>
                {formatSimpleDate2(item.tgl_tagihan)}
            </Table.Cell>
            <Table.Cell>
                {formatRupiah(item.nilai_tagihan)}
            </Table.Cell>
            <Table.Cell className={'truncate w-0'}>
                <div className="flex items-center gap-2">
                    <UpdateTagihanModal item={item} />
                    <CloseButton isDisabled={!canEdit} onPress={() => onDropHandle(item.id)} />
                </div>
            </Table.Cell>
        </Table.Row>
    )
}

export default ItemTagihan