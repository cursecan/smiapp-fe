import { Button, Table } from '@heroui/react'
import { PencilToSquare, Xmark } from '@gravity-ui/icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRincianCashService } from '../../../../services/oprasional/cashService'
import { formatRupiah } from '../../../../utils/formatCurrency'

const ItemRincian = ({item}) => {
    const qc = useQueryClient()


    const deleteItem = useMutation({
        mutationFn: async (id) => {
            return await useRincianCashService.delete(id)
        },
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['chashbon_item_list']})
        }
    })

    const handleDelete = () => {
        deleteItem.mutate(item.id)
    }


  return (
    <Table.Row>
        <Table.Cell>
            {item?.keterangan}
        </Table.Cell>
        <Table.Cell className={'w-32'}>
            <div className="flex justify-end items-center gap-4">
                <div className="">
                    {
                        formatRupiah(item?.harga_satuan)
                    }
                </div>
                <div className="flex items-center justify-end">
                    <Button onPress={handleDelete} size='sm' isIconOnly variant='ghost'>
                        <Xmark className='text-red-500' />
                    </Button>
                    <Button size='sm' isIconOnly variant='ghost'>
                        <PencilToSquare className='text-sky-500' />
                    </Button>
                </div>
            </div>
        </Table.Cell>
    </Table.Row>
  )
}

export default ItemRincian