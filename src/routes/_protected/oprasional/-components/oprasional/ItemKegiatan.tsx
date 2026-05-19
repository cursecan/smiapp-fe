
import { Label, ProgressCircle, Table } from "@heroui/react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import CreateCatatanModal from "./progressCatatan/CreateCatatanModal"
import CatatanModal from "./progressCatatan/CatatanModal"

const ItemKegiatan = ({item}) => {
    const {reset} = useForm({defaultValues: item || {}})

    
    useEffect(() => {
        if (item) {
            reset({...item})
        }

    }, [item, reset])


  return (
    

    <Table.Row>
        {/* <Table.Cell>
            {item.index+1}
        </Table.Cell> */}
        <Table.Cell className={'w-0 truncate'}>
            <div className="flex items-center gap-2">
                <ProgressCircle value={item.progress}>
                    <ProgressCircle.Track>
                        <ProgressCircle.TrackCircle />
                        <ProgressCircle.FillCircle />
                    </ProgressCircle.Track>
                </ProgressCircle>
                <Label>{item.progress}%</Label>

            </div>
        </Table.Cell>
        <Table.Cell>
            <Label>{item.barang_jasa} {!!item.parent && `(${item.parent.barang_jasa})`}</Label>
        </Table.Cell>
        <Table.Cell>
            <div className="flex gap-2 items-center">
                <CreateCatatanModal item={item} />
                <CatatanModal catatan={item.catatan || []} />
            </div>
        </Table.Cell>
    </Table.Row>
  )
}

export default ItemKegiatan