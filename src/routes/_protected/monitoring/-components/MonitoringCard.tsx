import { useQuery } from "@tanstack/react-query"
import { useDashboardService } from "../../../../services/dashboad/dashboardService"
import { Card, Chip, Description, Surface } from "@heroui/react"
import { Link } from "@tanstack/react-router"
import { formatRupiah } from "../../../../utils/formatCurrency"
import { Link as LinkHero } from '@heroui/react';

const MonitoringCard = () => {
    const {data: monitoring} = useQuery({
        queryKey: ['dashboard-monitoring'],
        queryFn: () => useDashboardService.monitoring(),
        select: (res) => res.data
    })

    return (
        <div className="">
            <Card>
                <Card.Header>
                    <Card.Title>Monitoring Unclosed</Card.Title>
                </Card.Header>
                <Card.Content>
                    <div className="grid grid-cols-5 gap-3">
                    <Surface variant='secondary' className='rounded-2xl p-3 space-y-3'>
                        <div className="flex gap-2 items-center">
                        <Description className="">Penawaran</Description>
                        <Chip className='bg-success'>{monitoring?.penawaran.un_close}</Chip>
                        </div>
                        <div className="flex flex-col">
                        <Link to={'/komersial/penawaran?filter=inisiasi'}>
                            <div className="link gap-2">
                            <p className='text-lg'>{formatRupiah(monitoring?.penawaran.un_close_amount)}</p>
                            <LinkHero.Icon className='text-accent' />
                            </div>
                        </Link>
                        </div>
                    </Surface>
                    <Surface variant='secondary' className='rounded-2xl p-3 space-y-3'>
                        <div className="flex gap-2 items-center">
                        <Description className="">Tidak ada SPK/PO</Description>
                        <Chip className='bg-danger'>{monitoring?.penawaran.no_spk_count}</Chip>
                        </div>
                        <div className="flex flex-col">
                        <Link to={'/monitoring?nospk=true'}>
                            <div className="link gap-2">
                            <p className='text-lg'>{formatRupiah(monitoring?.penawaran.no_spk_amount)}</p>
                            <LinkHero.Icon className='text-accent' />
                            </div>
                        </Link>
                        </div>
                    </Surface>
                    <Surface variant='secondary' className='rounded-2xl p-3 space-y-3'>
                        <div className="flex gap-2 items-center">
                        <Description className="">Progress On Operasional</Description>
                        <Chip className='bg-warning'>{monitoring?.oprasional.un_close}</Chip>
                        </div>
                        <div className="flex flex-col">
                        <Link to={'/komersial/penawaran'}>
                            <div className="link gap-2">
                            <p className='text-lg'>{formatRupiah(monitoring?.oprasional.un_close_amount)}</p>
                            <LinkHero.Icon className='text-accent' />
                            </div>
                        </Link>
                        </div>
                    </Surface>
                    <Surface variant='secondary' className='rounded-2xl p-3 space-y-3'>
                        <div className="flex gap-2 items-center">
                        <Description className="">BA Belum Invoice</Description>
                        <Chip className='bg-accent'>{monitoring?.oprasional.un_invoice}</Chip>
                        </div>
                        <div className="flex flex-col">
                        <Link to={'/komersial/penawaran?noinv=1'}>
                            <div className="link gap-2">
                            <p className='text-lg'>{formatRupiah(monitoring?.oprasional.un_invoice_amount)}</p>
                            <LinkHero.Icon className='text-accent' />
                            </div>
                        </Link>
                        </div>
                    </Surface>
                    <Surface variant='secondary' className='rounded-2xl p-3 space-y-3'>
                        <div className="flex gap-2 items-center">
                        <Description className="">Ready To Delivery Inv</Description>
                        <Chip className='bg-success'>{monitoring?.oprasional.undeliver_inv}</Chip>
                        </div>
                        <div className="flex flex-col">
                        <Link to={'/komersial/penawaran?noinv=1'}>
                            <div className="link gap-2">
                            <p className='text-lg'>{formatRupiah(monitoring?.oprasional.undeliver_inv_amount)}</p>
                            <LinkHero.Icon className='text-accent' />
                            </div>
                        </Link>
                        </div>
                    </Surface>
                    </div>
                </Card.Content>
            </Card>
        </div>
    )
}

export default MonitoringCard