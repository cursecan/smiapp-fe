import { Pencil, TrashBin } from '@gravity-ui/icons'
import { Button, Description, Input, Label, Table } from '@heroui/react'
import ItemPenawaranModal from './ItemPenawaranModal'
import UpdateItemModal from './UpdateItemModal'
import DeleteItemModal from './DeleteItemModal'
import CurrencyInput from '../../../../../components/input/CurrencyInput'
import { formatRupiah } from '../../../../../utils/formatCurrency'

const ItemPenawaranPekerjaan = ({id, item, canEdit}) => {
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
                        {
                            canEdit && (
                                <div className="flex gap-2 w-32 justify-end">
                                    <ItemPenawaranModal simple id={id} parent={item.id} />
                                    {/* Update */}
                                    <UpdateItemModal item={item} />
                                    
                                    {/* Delete */}
                                    <DeleteItemModal item={item} />
                                </div>
                            )
                        }
                    </div>
                ) : (
                    <div className="">
                        <div className="flex gap-6">
                            <div className={`flex-1 ${item.parent && 'pl-6'}`}>
                                <div className="">{ item.barang_jasa }</div>
                                {
                                    !!item.keterangan && <Description>{item.keterangan}</Description>
                                }
                            </div>
                            <div className="flex flex-col gap-2">
                                <Description>Volume</Description>
                                {/* <Input readOnly type='number' className={'w-14'} value={item.qty} /> */}
                                <Label>{ formatRupiah(item.qty)}</Label>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Description className='text-right'>Harga HPP</Description>
                                {/* <Input readOnly type='number' className={'w-40'} value={item.harga_hpp} /> */}
                                {/* <CurrencyInput readOnly value={item.harga_hpp} className="w-32 text-right" /> */}
                                <Label>{ formatRupiah(item.harga_hpp)}</Label>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Description className='text-right'>Harga Satuan</Description>
                                {/* <Input readOnly type='number' className={'w-40'} value={item.harga_satuan} /> */}
                                {/* <CurrencyInput readOnly value={item.harga_satuan} className="w-32 text-right" /> */}
                                <Label>{ formatRupiah(item.harga_satuan)}</Label>
                            </div>
                        </div>
                        {
                            canEdit && (
                                    <div className="flex gap-2 justify-end mt-3">
                                        {
                                            !item.parent && (
                                                <ItemPenawaranModal simple id={id} parent={item.id} />
                                            )
                                        }
                                        {/* Update */}
                                        <UpdateItemModal item={item} />
                                        
                                        {/* Delete */}
                                        <DeleteItemModal item={item} />
                                    </div>
                            )
                        }
                    </div>
                )
            }
        </Table.Cell>
    </Table.Row>
  )
}

export default ItemPenawaranPekerjaan