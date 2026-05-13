import { CodePullRequestCheck, Comment, CommentPlus, PencilToSquare } from "@gravity-ui/icons"
import { Button, Checkbox, Description, Disclosure, Label, ProgressCircle, Slider, Surface, Table } from "@heroui/react"
import { useEffect, useRef, useState } from "react"
import InputText from "../../../../../components/input/InputText"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCatatanOpsService } from "../../../../../services/oprasional/catatanService"
import { useParams } from "@tanstack/react-router"
import { useFormatDate } from "../../../../../utils/dateFormat"
import { Controller, useForm, useWatch } from "react-hook-form"
import { useItemPenawaranService } from "../../../../../services/penawaran.service"
import CreateCatatanModal from "./progressCatatan/CreateCatatanModal"
import CatatanModal from "./progressCatatan/CatatanModal"

const ItemKegiatan = ({item}) => {
    const { id } = useParams({from: '/_protected/oprasional/oprasional/$id'})
    const [expand, setExpand] = useState(false)
    const [form, setForm] = useState({
        oprasional: id,
        item_penawaran: item.id,
        keterangan: ''
    })
    const {control, reset, handleSubmit} = useForm({defaultValues: item || {}})

    const qc = useQueryClient()
    const save_mutation = useMutation({
        mutationFn: async (payload) => {
            return await useCatatanOpsService.create(payload)
        },
        onSuccess: (res) => {
            qc.invalidateQueries({queryKey: ['catatan-list']})
            setExpand(false)
        }
    })

    const handleSubmitSimpan = () => {
        save_mutation.mutate(form)
    }

    const progress_save_mt = useMutation({
        mutationFn: async (payload) => {
            return await useItemPenawaranService.progress(item.id, payload)
        },
        onSuccess: (res) => {
            qc.invalidateQueries({queryKey: ['catatan-list']})
        }
    })
    
    const handleUpdateProgressSubmit = (formData) => {
        progress_save_mt.mutate(formData)
    }
    
    const timeout = useRef(0)
    const handleUpdateProgress = (field, e) => {
        field.onChange(e)
        if (timeout.current) {
            clearTimeout(timeout.current)
        }
        
        timeout.current = setTimeout(() => {
            // console.log(e);
            handleSubmit(handleUpdateProgressSubmit)()
        }, 600);
    }

    const progress = useWatch({
        name: 'progress',
        control: control
    })
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