
import { CloseButton, Label, Table, useOverlayState } from "@heroui/react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { ArrowChevronDown } from "@gravity-ui/icons"
import { formatRupiah } from "../../../../../utils/formatCurrency"
import ModalComponent from "../../../../../components/modals/ModalComponent"
import { Link } from "@heroui/react"

const ItemKegiatan = ({item}) => {
    const {reset} = useForm({defaultValues: item || {}})
    const state = useOverlayState()
    
    useEffect(() => {
        if (item) {
            reset({...item})
        }

    }, [item, reset])
    


  return (
    <Table.Row>
        <Table.Cell>{item.progress} %</Table.Cell>
        <Table.Cell>{item.barang_jasa}</Table.Cell>
        <Table.Cell>{item.qty}</Table.Cell>
        <Table.Cell>{ formatRupiah(item.harga_satuan)}</Table.Cell>
        <Table.Cell className={'truncate w-0'}>
            <ModalComponent
                size={'lg'}
                state={state}
                heading={'Dokumen Upload'}
                buttonTrigger={<CloseButton onPress={state.setOpen} className={'bg-rose-500 text-white'}>
                    <ArrowChevronDown />
                </CloseButton>}
                hideFooter
            >
                <div className="mt-2">
                    <ul className="">
                        {
                            item.docs.map((i, index) => {
                                return (
                                    <li key={index}>
                                        <Link href={i.filepath} target="_blank">
                                            <div className="flex items-center">
                                                <img src='/pdf_icon.png' className="w-10" />
                                                <Label className="text-gray-400 text-xs">{i.filename.split('_').splice(1).join('_')}</Label>
                                            </div>
                                        </Link>

                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>

            </ModalComponent>
        </Table.Cell>
    </Table.Row>
  )
}

export default ItemKegiatan