import { Description, Label, Table } from '@heroui/react'
import UpdateItemModal from './UpdateItemModal'
import DeleteItemModal from './DeleteItemModal'
import { formatRupiah } from '../../../../../utils/formatCurrency'

const ItemPenawaranPekerjaan = ({ item, canEdit}) => {
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
                                    !!item.sub_content_html && (
                                        <Description>
                                            <div className="ml-5" dangerouslySetInnerHTML={{__html: item.sub_content_html}}></div>
                                        </Description>
                                    )
                                }
                                {
                                    !!item.keterangan && <Description>{item.keterangan}</Description>
                                }
                            </div>
                        </div>
                        
                    </div>
                )
            }
        </Table.Cell>
        <Table.Cell>
            {item.qty}
        </Table.Cell>
        <Table.Cell className={'truncate'}>
            { item.satuan?.nama_satuan || '-'}
        </Table.Cell>
        <Table.Cell className={'w-0 truncate'}>
            {
                !item.is_header && (
                    <div className="">
                        { formatRupiah(item.harga_satuan)}
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