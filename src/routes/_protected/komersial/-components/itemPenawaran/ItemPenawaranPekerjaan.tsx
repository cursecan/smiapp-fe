import { Description, Label, Table } from '@heroui/react'
import UpdateItemModal from './UpdateItemModal'
import DeleteItemModal from './DeleteItemModal'
import { formatRupiah } from '../../../../../utils/formatCurrency'
import { useMemo } from 'react'

const ItemPenawaranPekerjaan = ({ item, canEdit}) => {
    // console.log(canEdit, 'canedit');

    const marginHarga = useMemo(() => {
        if (item?.harga_hpp > 0 ) {
            return ((item?.harga_satuan - item?.harga_hpp) * 100 / item?.harga_hpp).toFixed(1)
        }
        return 0
    })
    
  return (
    <Table.Row>
        <Table.Cell>
            {
                item.is_header ? (
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <Label className='text-gray-500'>{item.barang_jasa}</Label>
                        </div>
                    </div>
                ) : (
                    <div className="">
                        <div className="flex gap-6">
                            <div className={`flex-1 ${!!item.parent && 'pl-5'}`}>
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
            {
                !item.is_header && (
                    <div className="">
                        {item.qty}
                    </div>
                )
            }
        </Table.Cell>
        <Table.Cell className={'truncate'}>
            {
                !item.is_header && (
                    <div className="">
                        { item.satuan?.nama_satuan || '-'}
                    </div>
                )
            }
        </Table.Cell>
        <Table.Cell className={'w-0 truncate'}>
            {
                !item.is_header && (
                    <div className="">
                        { formatRupiah(item.harga_satuan)}
                        {/* <Description>{ formatRupiah(item.harga_satuan)}</Description> */}
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
        <Table.Cell className={'w-0 truncate'}>
            {
                !item.is_header && !item.is_aggency_fee && (
                    <div className="">{marginHarga}%</div>
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