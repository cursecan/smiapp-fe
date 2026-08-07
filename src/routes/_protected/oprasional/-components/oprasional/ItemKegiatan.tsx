
import { CloseButton, Description, Label, Table, useOverlayState } from "@heroui/react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { ArrowChevronDown, FileXmark, TrashBin } from "@gravity-ui/icons"
import { formatRupiah } from "../../../../../utils/formatCurrency"
import ModalComponent from "../../../../../components/modals/ModalComponent"
import { Link } from "@heroui/react"
import UploadDocProgressModal from "./progressCatatan/UploadDocProgressModal"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useProgressService } from "../../../../../services/oprasional/progressService"

const ItemKegiatan = ({item}) => {
    const {reset} = useForm({defaultValues: item || {}})
    const state = useOverlayState()

    const [docs, setDocs] = useState([])

    const qc = useQueryClient()

    const dropmutation = useMutation({
        mutationFn: (id) => useProgressService.drop(id),
        onSuccess: (res) => {
            console.log(res);
            
            qc.invalidateQueries({queryKey: ['progress-list']})
            const newDocs = docs.filter(i => i.id !== res?.data?.id)
            setDocs(newDocs)
        } 
    })

    const prostDropHandle = (id) => {
        dropmutation.mutate(id)
    }


    console.log(item, 'itemssssssssssss');
    

    useEffect(() => {
        setDocs(item?.docs)
    }, [])
    
    useEffect(() => {
        if (item) {
            reset({...item})
        }

    }, [item, reset])
    


  return (
    <Table.Row>
        <Table.Cell>{item.progress} %</Table.Cell>
        <Table.Cell>
            <div className="flex flex-col gap-1">
                {
                    item.parent && <Description>{item.parent.barang_jasa}</Description>
                }
                <Label>{item.barang_jasa}</Label>
                {
                    item.ketarangan && <Description>{item.keterangan}</Description>
                }
            </div>
        </Table.Cell>
        <Table.Cell>{item.qty}</Table.Cell>
        <Table.Cell>{ formatRupiah(item.harga_satuan)}</Table.Cell>
        <Table.Cell className={'truncate w-0'}>
            <div className="flex items-center gap-4">
                <UploadDocProgressModal item={item} ops={item.ops} data={[]} />
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
                                docs.map((i, index) => {
                                    return (
                                        <li key={index} className="flex gap-3">
                                            <Link href={i.filepath} target="_blank" className={'flex-1'}>
                                                <div className="flex items-center">
                                                    <img src='/pdf_icon.png' className="w-10" />
                                                    <Label className="text-gray-400 text-xs">{i.filename.split('_').splice(1).join('_')}</Label>
                                                </div>
                                            </Link>
                                            <CloseButton onPress={() => prostDropHandle(i.id)}>
                                                <TrashBin className="text-red-500" />
                                            </CloseButton>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>

                </ModalComponent>
            </div>
        </Table.Cell>
    </Table.Row>
  )
}

export default ItemKegiatan