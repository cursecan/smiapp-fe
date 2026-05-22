import { Description, Label, Table } from '@heroui/react'
import ItemPenawaranModal from './ItemPenawaranModal'
import UpdateItemModal from './UpdateItemModal'
import DeleteItemModal from './DeleteItemModal'
import { formatRupiah } from '../../../../../utils/formatCurrency'

const ItemPenawaranPekerjaan = ({id, pelabuhan, item, canEdit}) => {
    // console.log(canEdit, 'canedit');
    
  return (
    <Table.Row>
        <Table.Cell>
            {
                item.is_header ? (
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <Label>{item.barang_jasa}</Label>
                        </div>
                    </div>
                ) : (
                    <div className="">
                        <div className="flex gap-6">
                            <div className={`flex-1`}>
                                <div className="">{ item.barang_jasa }</div>
                                {
                                    !!item.keterangan && <Description>{item.keterangan}</Description>
                                }
                            </div>
                        </div>
                        
                    </div>
                )
            }
        </Table.Cell>
        <Table.Cell className={'w-0 truncate'}>
            {
                !item.is_header && (
                    <div className="">
                        {item.qty} x @{ formatRupiah(item.harga_satuan)}
                    </div>
                )
            }
        </Table.Cell>
        <Table.Cell className={'w-0 truncate'}>
            {
                !item.is_header && (
                    <div className="">{ formatRupiah(item.harga_satuan * item.qty)}</div>
                )
            }
        </Table.Cell>
        {
            canEdit && (
                <Table.Cell className={'w-0 truncate'}>
                    {
                        canEdit && (
                                <div className="flex gap-2 justify-end">
                                    {
                                        !item.parent && (
                                            <ItemPenawaranModal pelabuhan={pelabuhan} simple id={id} parent={item.id} />
                                        )
                                    }
                                    {/* Update */}
                                    <UpdateItemModal item={item} />
                                    
                                    {/* Delete */}
                                    <DeleteItemModal item={item} />
                                </div>
                        )
                    }
                </Table.Cell>
            )
        }
    </Table.Row>
  )
}

export default ItemPenawaranPekerjaan