import { CloseButton, Table } from "@heroui/react"
import { formatRupiah } from "../../../../../utils/formatCurrency"

const CasbonListItem = ({item, canEdit=false}) => {

    const total = Number(item.harga) * item.qty

  return (
    <Table.Row>
        <Table.Cell>
            {item.pekerjaan}
        </Table.Cell>
        <Table.Cell>{item.qty}</Table.Cell>
        <Table.Cell>{item.satuan.nama_satuan}</Table.Cell>
        <Table.Cell>{formatRupiah(item.harga)}</Table.Cell>
        <Table.Cell>{formatRupiah(total)}</Table.Cell>
        <Table.Cell>
            <CloseButton isDisabled={!canEdit} />
        </Table.Cell>
    </Table.Row>
  )
}

export default CasbonListItem