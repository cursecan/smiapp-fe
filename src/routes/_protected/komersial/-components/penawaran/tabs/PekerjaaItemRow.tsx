import { Table } from "@heroui/react"
import PekerjaanComboBox from "../../../../../../components/input/PekerjaanComboBox"
import InputText from "../../../../../../components/input/InputText"
import { useState } from "react"

const PekerjaaItemRow = ({item}) => {
    const [form, setForm] = useState({
        reference_item: item?.refereance_item ?? '',
        barang_jasa: item?.barang_jasa ?? '',
        qty: item?.qty ?? 0,
        harga_satuan: item?.harga_satuan ?? 0,
        harga_hpp: item?.harga_hpp ?? 0,
        penawaran: item?.penawaran ?? '',
        keterangan: item?.keterangan ?? ''
    })
    
  return (
    <>
        <Table.Row>
            <Table.Cell>
                <PekerjaanComboBox value={form.reference_item} onChange={(e) => setForm({...form, reference_item: e})} />
                <InputText value={form.barang_jasa} onChange={(e) => setForm({...form, barang_jasa: e.target.value})} />
            </Table.Cell>
            <Table.Cell>
                <InputText value={form.qty} onChange={(e) => setForm({...form, qty: e.target.value})} />
            </Table.Cell>
            <Table.Cell>
                <InputText value={form.harga_satuan} onChange={(e) => setForm({...form, harga_satuan: e.target.value})} />
            </Table.Cell>
            <Table.Cell></Table.Cell>
        </Table.Row>
    </>
  )
}

export default PekerjaaItemRow