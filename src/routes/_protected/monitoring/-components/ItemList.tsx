import { Avatar, Description, Label, Table } from "@heroui/react"
import { formatRupiah } from "../../../../utils/formatCurrency"
import StatusChiper from "../../../../components/StatusChiper"
import { useMemo } from "react"

const ItemList = ({item}) => {
    const pengajuan_casbon = item?.casbon.reduce((a, b) => a + Number(b.total_hpp), 0) ?? 0 
    const terbayar = Math.max(item?.casbon.map(i => Number(i.terbayar)))

    const total_invioice = item?.invoices.reduce((a, b) => a + Number(b.nominal), 0)

    const status = useMemo(() => {
        let fasa = 'operasonal'
        let status = item?.status

        if (item.invoices.length > 0) {
            fasa = 'invoicing'
            status = item.invoices[-1].status
        }

        return `${fasa} - ${status}`
    }, [])


  return (
    <Table.Row>
        <Table.Cell className={'w-lg'}>
            <div className="flex flex-col">
                <Description className='text-accent'>{item.penawaran.nomor}</Description>
                <Label>{item.penawaran.nama_project}</Label>
                <div className="mt-3 flex flex-col">
                <Description>No. SPK</Description>
                <Label>{item.penawaran.nomor_penugasan}</Label>
                </div>
                <div className="mt-3 flex flex-col">
                {/* <Description>Tanggal Pesanan</Description>
                <Label>{item.penawaran.tgl_surat}</Label> */}
                    <Avatar size="sm">
                        <Avatar.Image alt={item.asign_name} src="https://img.heroui.chat/image/avatar?w=400&h=400&u=3" />
                        <Avatar.Fallback />
                    </Avatar>
                </div>
            </div>
        </Table.Cell>
        <Table.Cell>
            {formatRupiah(item.nilai_penawaran)}
        </Table.Cell>
        <Table.Cell>
            <Label className="text-rose-700">{formatRupiah(terbayar)}</Label>
        </Table.Cell>
        <Table.Cell>
            <Label>{formatRupiah(total_invioice)}</Label>
        </Table.Cell>
        <Table.Cell>
            <StatusChiper status={status} />
        </Table.Cell>
    </Table.Row>
  )
}

export default ItemList