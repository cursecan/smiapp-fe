import { Card, Description, Surface, Table, useOverlayState } from "@heroui/react"
import CreateTagihanModal from "./CreateTagihanModal"
import { retainSearchParams, useParams } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { useCasbonService } from "../../../../../services/oprasional/casbonService"
import ItemTagihan from "./ItemTagihan"
import { useEffect, useMemo, useState } from "react"
import { formatRupiah } from "../../../../../utils/formatCurrency"
import CurrencyInput from "../../../../../components/input/CurrencyInput"
import ModalComponent from "../../../../../components/modals/ModalComponent"
import ChangeTotalInvModal from "./ChangeTotalInvModal"

const ListTagihan = ({casbon, canEdit=false}) => {
    const { id } = useParams({from: '/_protected/oprasional/casbon/$id'})
    const {data} = useQuery({
        queryKey: ['tagihan-list'],
        queryFn: () => useCasbonService.items(id),
        select: (res) => res.data
    })

    const total = useMemo(() => {        
        return data?.reduce((a, b) => a + (Number(b.nilai_tagihan) ), 0)
    })

    const pph = useMemo(() => {
        return data?.reduce((a, b) => a + (Number(b.nilai_dasar_pajak)*b.pph_rate), 0)
        // if (casbon.nilai_invoice === 0 || Number(casbon.nilai_invoice) === total + Number(casbon.terbayar)) {
        //     return Math.ceil((total + Number(casbon.terbayar)) * casbon.pph_rate)
        // }
        // return 0


    })
    const ppn = useMemo(() => {
        return data?.reduce((a, b) => a + (Number(b.nilai_dasar_pajak)*b.ppn_rate), 0)
        // if (casbon.nilai_invoice === 0 || Number(casbon.nilai_invoice) === total + Number(casbon.terbayar)) {
        //     return Math.ceil((total + Number(casbon.terbayar)) * casbon.pph_rate)
        // }
        // return 0


    })

    const inv = useMemo(() => {
        if (casbon?.nilai_invoice > 0) {
            return casbon.nilai_invoice
        }
        return total + ppn
    })

    const total_after_pph = useMemo(() => {
        return total - pph + ppn
    })

    
    
  return (
    <Card variant="secondary">
        
        <Card.Content className="flex flex-col space-y-3">
            <div className="">
                <div className="flex justify-end">
                    <CreateTagihanModal canEdit={canEdit} casbonId={id} />
                </div>
                <div className="text-right">
                    <Description>Lorem ipsum dolor sit amet consectetur adipisicing elit. At, saepe.</Description>
                </div>
            </div>
            <Surface className="rounded-2xl p-3">
                <Table>
                    <Table.ScrollContainer>
                        <Table.Content>
                            <Table.Header>
                                <Table.Column isRowHeader>
                                    Invoice / Tagihan
                                </Table.Column>
                                <Table.Column>Tanggal Invoice</Table.Column>
                                <Table.Column className={'w-32'}>Nominal</Table.Column>
                                <Table.Column className={'truncate w-0'}></Table.Column>
                            </Table.Header>
                            <Table.Body>
                                {
                                    data?.map(i => {
                                        return (
                                            <ItemTagihan canEdit={canEdit} key={i.id} item={i} />
                                        )
                                    })
                                }
                                <Table.Row>
                                    <Table.Cell colSpan={2} className={'text-right italic'}>Total Sebelum</Table.Cell>
                                    <Table.Cell colSpan={2} className={'italic'}>{formatRupiah(total)}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell colSpan={2} className={'text-right italic'}>PPn</Table.Cell>
                                    <Table.Cell colSpan={2} className={'italic'}>{formatRupiah(ppn)}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell colSpan={2} className={'text-right italic'}>Total Setelah PPn</Table.Cell>
                                    <Table.Cell colSpan={2} className={'italic'}>{formatRupiah(total + ppn)}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell colSpan={2} className={'text-right italic'}>Potongan PPH</Table.Cell>
                                    <Table.Cell colSpan={2} className={'italic'}>({formatRupiah(pph)})</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell colSpan={2} className={'text-right font-semibold italic'}>Total Pembayaran</Table.Cell>
                                    <Table.Cell colSpan={2} className={'font-semibold italic'}>{formatRupiah(total_after_pph)}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell colSpan={2} className={'text-right font-semibold italic'}>Total Invoice</Table.Cell>
                                    <Table.Cell colSpan={2} className={'font-semibold italic'}>
                                        <div className="flex items-center">
                                            <div className="flex-1">{formatRupiah(inv)}</div>
                                            {
                                                canEdit && (
                                                    <div className="">
                                                        <ChangeTotalInvModal casbon={casbon} invInit={inv} />
                                                    </div>

                                                )
                                            }
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Content>
                    </Table.ScrollContainer>
                </Table>

            </Surface>
        </Card.Content>
    </Card>
  )
}

export default ListTagihan