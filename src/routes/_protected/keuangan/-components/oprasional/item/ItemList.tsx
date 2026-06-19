import { Description, Label, Table } from '@heroui/react'
import { formatRupiah } from '../../../../../../utils/formatCurrency'

const ItemList = ({casbon, data=[]}) => {
  return (
    <Table className='font-mono'>
        <Table.ScrollContainer>
            <Table.Content>
                <Table.Header>
                    <Table.Column isRowHeader>
                        Detail Item 
                    </Table.Column>
                    <Table.Column  className={'w-0'}>
                        Vol
                    </Table.Column>
                    <Table.Column className={'w-0'}>
                        Amount
                    </Table.Column>
                    <Table.Column className={'w-0'}>
                        Total
                    </Table.Column>
                </Table.Header>
                <Table.Body>
                    {
                        data.map(i => {
                            return (
                                <Table.Row key={i.id}>
                                    <Table.Cell>
                                        <div className="flex flex-col gap-1">
                                            <Label>{i.pekerjaan}</Label>
                                            {
                                                !!i.keterangan && <Description>{i.keterangan}</Description> 
                                            }
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>{i.qty}</Table.Cell>
                                    <Table.Cell>{formatRupiah(i.harga)}</Table.Cell>
                                    <Table.Cell>{formatRupiah(i.harga * i.qty)}</Table.Cell>
                                </Table.Row>
                            )
                        })
                    }
                    <Table.Row>
                        <Table.Cell className={'text-left font-semibold'} colSpan={3}>
                            Total
                        </Table.Cell>
                        <Table.Cell className={'font-semibold'}>{formatRupiah(casbon.total_hpp)}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell className={'text-left font-semibold'} colSpan={3}>
                            PPn 11%
                        </Table.Cell>
                        <Table.Cell className={'font-semibold'}>{formatRupiah(casbon.ppn)}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell className={'text-left font-semibold'} colSpan={3}>
                            Potongan PPh {casbon.pph_rate * 100}%
                        </Table.Cell>
                        <Table.Cell className={'font-semibold'}>{formatRupiah(casbon.pph)}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell className={'text-left font-semibold'} colSpan={3}>
                            Grand Total
                        </Table.Cell>
                        <Table.Cell className={'font-semibold'}>{formatRupiah(casbon.grand_total)}</Table.Cell>
                    </Table.Row>
                    {
                        casbon.total_expense.total > 0  && (
                            <Table.Row>
                                <Table.Cell className={'text-left text-success'} colSpan={3}>
                                    Sudah Ditransfer
                                </Table.Cell>
                                <Table.Cell className={' text-success'}>{formatRupiah(casbon.total_expense.total)}</Table.Cell>
                            </Table.Row>

                        )
                    }
                    {
                        casbon.grand_total-casbon.total_expense.total > 0 && (
                            <Table.Row>
                                <Table.Cell className={'text-left text-danger'} colSpan={3}>
                                    Sisa Belum Transfer
                                </Table.Cell>
                                <Table.Cell className={'text-danger'}>{formatRupiah(casbon.grand_total-casbon.total_expense.total)}</Table.Cell>
                            </Table.Row>

                        )
                    }
                </Table.Body>
            </Table.Content>
        </Table.ScrollContainer>
    </Table>
  )
}

export default ItemList