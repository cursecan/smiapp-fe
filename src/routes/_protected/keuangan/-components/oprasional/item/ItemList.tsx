import { CloseButton, Description, Label, Table } from '@heroui/react'
import { formatRupiah } from '../../../../../../utils/formatCurrency'
import { formatSimpleDate2 } from '../../../../../../utils/dateFormat'
import { File } from '@gravity-ui/icons'
import { useMemo } from 'react'

const ItemList = ({casbon, data=[]}) => {
    
  return (
    <Table className='font-mono'>
        <Table.ScrollContainer>
            <Table.Content>
                <Table.Header>
                    <Table.Column isRowHeader>
                        Invoice / Tagihan
                    </Table.Column>
                    <Table.Column  className={'w-0 truncate'}>
                        Tanggal Invoice
                    </Table.Column>
                    <Table.Column className={'w-0 truncate'}>
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
                                            <Label>{i.catatan}</Label>
                                            <Description>No Inv. {i.nomor_tagihan || '-'}</Description>
                                            <div className="mt-3">
                                                <a href={i.file_path} target='_blank'>
                                                    <CloseButton className={'bg-amber-500 text-white'}>
                                                        <File />
                                                    </CloseButton>
                                                </a>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell className={'align-baseline'}>{formatSimpleDate2(i.tgl_tagihan)}</Table.Cell>
                                    <Table.Cell className={'align-baseline'}>{formatRupiah(i.nilai_tagihan)}</Table.Cell>
                                </Table.Row>
                            )
                        })
                    }
                    <Table.Row>
                        <Table.Cell className={'text-left font-semibold'} colSpan={2}>
                            Total
                        </Table.Cell>
                        <Table.Cell className={'font-semibold'}>{formatRupiah(casbon.total_hpp)}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell className={'text-left font-semibold'} colSpan={2}>
                            PPn 11%
                        </Table.Cell>
                        <Table.Cell className={'font-semibold'}>{formatRupiah(casbon.ppn)}</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell className={'text-left font-semibold'} colSpan={2}>
                            Potongan PPh {casbon.pph_rate * 100}%
                        </Table.Cell>
                        <Table.Cell className={'font-semibold'}>({formatRupiah(casbon.pph)})</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell className={'text-left'} colSpan={2}>
                            <div className="flex flex-col">
                                <Label>Grand Total</Label>
                                <Description>Total yang harus ditransfer.</Description>
                            </div>
                        </Table.Cell>
                        <Table.Cell className={'font-semibold'}>{formatRupiah(casbon.grand_total)}</Table.Cell>
                    </Table.Row>
                    {
                        casbon.total_expense.total > 0  && (
                            <Table.Row>
                                <Table.Cell className={'text-left text-success'} colSpan={2}>
                                    Sudah Ditransfer
                                </Table.Cell>
                                <Table.Cell className={' text-success'}>{formatRupiah(casbon.total_expense.total)}</Table.Cell>
                            </Table.Row>

                        )
                    }
                    {
                        casbon.grand_total-casbon.total_expense.total > 0 && (
                            <Table.Row>
                                <Table.Cell className={'text-left text-danger'} colSpan={2}>
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