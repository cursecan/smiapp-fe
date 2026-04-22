import { Comment } from "@gravity-ui/icons"
import { Button, Checkbox, Description, Disclosure, Label, Slider, Surface, Table } from "@heroui/react"
import { useEffect, useRef, useState } from "react"
import InputText from "../../../../../components/input/InputText"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useCatatanOpsService } from "../../../../../services/oprasional/catatanService"
import { useParams } from "@tanstack/react-router"
import { useFormatDate } from "../../../../../utils/dateFormat"
import { Controller, useForm, useWatch } from "react-hook-form"
import { useItemPenawaranService } from "../../../../../services/penawaran.service"

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
        <Table.Cell>
            {item.index+1}
        </Table.Cell>
        <Table.Cell>
            <div className="flex flex-col">
                <Label>{item.barang_jasa} {!!item.parent && `(${item.parent.barang_jasa})`}</Label>
                {/* <Description>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, autem!
                </Description> */}
                {
                    item.catatan.length > 0 && (
                        <div className="mt-3">
                            {
                                item.catatan.map(i => {
                                    return (
                                        <div className="ml-6" key={i.id}>
                                            <Surface variant="secondary" className="rounded-2xl">
                                                <div className="p-2">
                                                    <Description>{useFormatDate(i.create_at)}</Description>
                                                    <div className="flex-1">
                                                        {i.keterangan}
                                                    </div>
                                                </div>
                                            </Surface>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }
                <div className="mt-3">
                    <Disclosure
                        isExpanded={expand}
                        onExpandedChange={setExpand}
                    >
                        <Disclosure.Heading>
                            {
                                !expand && (
                                    <Button slot="trigger" size="sm">
                                        <Comment />
                                        Catatan
                                    </Button>
                                )
                            }
                        </Disclosure.Heading>
                        <Disclosure.Content>
                            <Disclosure.Body>
                                <div className="">
                                    <InputText value={form.keterangan} onChange={(e) => setForm({...form, keterangan: e.target.value})} placeholder="Tuliskan keterangan" />
                                </div>
                                <div className="flex mt-4 items-center gap-2">
                                    <Button variant="tertiary" onPress={() => setExpand(false)}>Close</Button>
                                    <Button onPress={handleSubmitSimpan}>Simpan</Button>
                                </div>
                            </Disclosure.Body>
                        </Disclosure.Content>
                    </Disclosure>
                </div>
            </div>
        </Table.Cell>
        <Table.Cell>
            <Controller
                name="progress"
                control={control}
                render={({field}) => (
                    <Slider {...field} value={field.value} onChange={(e) => handleUpdateProgress(field, e)} className="w-full max-w-xs" defaultValue={0} >
                        {/* <Label>Progress</Label> */}
                        <Slider.Output />
                        <Slider.Track>
                            <Slider.Fill />
                            <Slider.Thumb />
                        </Slider.Track>
                    </Slider>
                )}
            />
        </Table.Cell>
        <Table.Cell>
            <Checkbox isDisabled isSelected={progress>=100}>
                <Checkbox.Control>
                    <Checkbox.Indicator />
                </Checkbox.Control>
            </Checkbox>
        </Table.Cell>
    </Table.Row>
  )
}

export default ItemKegiatan