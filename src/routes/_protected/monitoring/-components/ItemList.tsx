import { Avatar, Chip, Description, Label, Table } from "@heroui/react"
import { formatRupiah } from "../../../../utils/formatCurrency"
import StatusChiper from "../../../../components/StatusChiper"
import { useMemo } from "react"
import { MapPin } from "@gravity-ui/icons"

const ItemList = ({item}) => {

    const total_invioice = item?.invoices.reduce((a, b) => a + Number(b.nominal), 0)
    const nospk = ['0', ''].includes(item.penawaran.nomor_penugasan)

    const status = useMemo(() => {
        let fasa = 'operasonal'
        let status = item?.status
        

        if (item.invoices.length > 0) {
            fasa = 'invoicing'
            status = item?.invoices.at(-1).status
        }

        return `${fasa} - ${status}`
    }, [])


  return (
    <Table.Row>
        <Table.Cell className={'w-lg'}>
            <div className="flex flex-col">
                <Description className='text-accent'>{item.penawaran.nomor}</Description>
                <Label>{item.penawaran.nama_project}</Label>
                {
                    !nospk && (
                        <div className="mt-3 flex flex-col">
                            <Description>No. SPK</Description>
                            <Label>{item.penawaran.nomor_penugasan}</Label>
                        </div>
                    )
                }
                <div className="flex items-center mt-3 gap-4">
                    <div className="flex gap-2 items-center">
                        <Avatar size="sm">
                            <Avatar.Image alt={item.asign_name} src="https://img.heroui.chat/image/avatar?w=400&h=400&u=3" />
                            <Avatar.Fallback />
                        </Avatar>
                        <div className="">
                            <Label>{item.asign_name}</Label>
                        </div>
                    </div>
                    <div className="flex gap-1 items-center">
                            <MapPin className="text-orange-500" />
                        <div className="">
                            <Label>{item.penawaran.pelabuhan?.nama_pelabuhan}</Label>
                        </div>
                    </div>

                </div>
            </div>
        </Table.Cell>
        <Table.Cell>
            {formatRupiah(item.nilai_penawaran)}
        </Table.Cell>
        <Table.Cell>
            <Label className="text-rose-700">{formatRupiah(item.expense_op?.total_expense)}</Label>
        </Table.Cell>
        <Table.Cell>
            <Label>{formatRupiah(total_invioice)}</Label>
        </Table.Cell>
        <Table.Cell className={'w-0 truncate'}>
            <div className="flex flex-col gap-3">
                <StatusChiper status={status} />
                {
                    nospk && (
                        <Chip className="bg-danger text-white">
                            Belum ada PO/SPK
                        </Chip>

                    )
                }

            </div>
        </Table.Cell>
    </Table.Row>
  )
}

export default ItemList