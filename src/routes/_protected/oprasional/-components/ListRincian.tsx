import { Table } from '@heroui/react'
import CreateModalRincian from './pembayaran/CreateModalRincian'
import { useQuery } from '@tanstack/react-query'
import { useCashService } from '../../../../services/oprasional/cashService'
import InputText from '../../../../components/input/InputText'
import ItemRincian from './ItemRincian'

const ListRincian = ({pembayaran}) => {

    const {data, isLoading} = useQuery({
        queryKey: ['chashbon_item_list'],
        queryFn: async () => {
            return await useCashService.rincian(pembayaran.id)
        },
        select: (data) => data.data
    })

    if (isLoading) {
        return <div className="">Loading...</div>
    }

    console.log(data);


  return (
    <div className="">
        <CreateModalRincian pembayaran={pembayaran} />
        {/* <Card className='mt-3' variant='secondary'>
            <Card.Header>
                <Card.Title>Nama Barang & Jasa</Card.Title>
            </Card.Header>

        </Card> */}
        <Table className='mt-3'>
            <Table.ScrollContainer>
                <Table.Content>
                    <Table.Header>
                        <Table.Column isRowHeader>Barang & Jasa</Table.Column>
                        <Table.Column>Nilai</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {
                            data?.map(i => {
                                return (
                                    <ItemRincian item={i} key={i.id} />
                                )
                            })
                        }
                    </Table.Body>
                </Table.Content>
            </Table.ScrollContainer>
        </Table>
    </div>
  )
}

export default ListRincian