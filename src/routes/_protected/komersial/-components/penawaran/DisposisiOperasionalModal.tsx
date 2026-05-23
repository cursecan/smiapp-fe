import { Button, Label, Surface, useOverlayState, Select, ListBox } from "@heroui/react"
import ModalComponent from "../../../../../components/modals/ModalComponent"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useToast } from "../../../../../lib/useToast"
import { usePegawayService } from "../../../../../services/masterdata/pegawayService"
import { useState } from "react"
import { useOprasionalService } from "../../../../../services/oprasional/oprasionalService"

const DisposisiOperasionalModal = ({penawaran, isDisabled}) => {
    const state = useOverlayState()
    const toast = useToast()

    const [user, setUser] = useState()

    const {data: pegawai, isLoading} = useQuery({
        queryKey: ['pegawai-list-formodal'],
        queryFn: async () => usePegawayService.list(),
        select: (data) => data.data
    })

    const qc = useQueryClient()
    const mutation = useMutation({
        mutationFn: (payload) => useOprasionalService.create(payload),
        onSuccess: () => {
            toast.success({message: 'Berhasil', description: 'Penawaran berhasil disposisi ke bidang operasional.'})        
            qc.invalidateQueries({queryKey: ['detail-penawaran', penawaran.id]})
            state.close()
        }
    })


    const handleSubmit = () => {
        mutation.mutate({penawaran: penawaran.id, assign_to: user})
    }
    
    if (isLoading) {
        return false
    }


  return (
    <ModalComponent
        state={state}
        buttonTrigger={<Button isDisabled={isDisabled} onPress={state.setOpen} className={'bg-red-600'}>Disposisi Bidang Ops</Button>}
        heading={'Disposisi Operasional'}
        hideFooter
    >
        <Surface>
            <div className="">
                <Select value={user} onChange={setUser} placeholder="Asign to operasional agen">
                    {/* <Label>Asign To</Label> */}
                    <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox>
                            {
                                pegawai.results.map(i => {
                                    return (
                                        <ListBox.Item key={i.id} id={i.user.id} textValue={i.user.full_name}>
                                            <Label>{i.user.full_name}</Label>
                                            {/* <Description>{i.jabatan.nama_jabatan}</Description> */}
                                        </ListBox.Item>
                                    )
                                })
                            }
                        </ListBox>
                    </Select.Popover>
                </Select>
                <div className="flex gap-2 mt-6 justify-end">
                    <Button onPress={state.close} variant="tertiary">
                        Batal
                    </Button>
                    <Button onPress={handleSubmit}>
                        Ya, Lanjutkan
                    </Button>
                </div>
            </div>
        </Surface>
    </ModalComponent>
  )
}

export default DisposisiOperasionalModal