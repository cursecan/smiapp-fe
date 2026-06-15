
import { Button, Card, Checkbox, Description, Label, Surface, useOverlayState } from "@heroui/react"
import { formatRupiah } from "../../../../../utils/formatCurrency"
import ModalComponent from "../../../../../components/modals/ModalComponent"
import CurrencyInput from "../../../../../components/input/CurrencyInput"
import { useState } from "react"
import { useParams } from "@tanstack/react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useExpenseService } from "../../../../../services/keuangan/expenseService"
import { useToast } from "../../../../../lib/useToast"
import StatusChiper from "../../../../../components/StatusChiper"
import DownloadButton from "../../../../../components/buttons/DownloadButton"
import {api} from '../../../../../lib/api'


const CasbonItem = ({item}) => {
    const { id } = useParams({from: '/_protected/keuangan/expense/$id'})
    const state = useOverlayState()

    const [form, setForm] = useState({
        exp_oprasional: id,
        casbon: item?.id,
        amount: 0,
        biaya_lainya: 0
    })
    const file_name = `FOFIN.${item?.nomor.replace(/\//g, '_')}.pdf`
    
    const toast = useToast()
    const qc = useQueryClient()

    const save_mutation = useMutation({
        mutationFn: (payload) => useExpenseService.create(payload),
        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ['exp-oprasiona-detail']
            })
            state.close()
            setForm({...form, amount: 0, biaya_lainya: 0})
            toast.success({message: 'Success', description: 'Update expese sukses.'})
        },
        onError: (err) => {
            toast.danger({message: 'Erros', description: err.message})
        }
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        save_mutation.mutate(form)
    }

  return (
    <Card>
        <Card.Header>
            <div className="flex justify-between items-center">
                <Card.Title>
                    <b>{item.nomor}</b>
                </Card.Title>
                {/* <Card.Title>{item.stepper.at(-1).name} at {formatDate(item.stepper.at(-2).approved_at)}</Card.Title> */}
            </div>
        </Card.Header>
        <Card.Content>
            <div className="flex items-center gap-6">
                <div className="flex flex-1 items-center gap-10">
                    <Checkbox isSelected={item.pembayaran}>
                        <Checkbox.Control>
                            <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Content>
                            <Label>Pembayaran</Label>
                        </Checkbox.Content>
                    </Checkbox>
                    <Checkbox isSelected={item.casbon}>
                        <Checkbox.Control>
                            <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Content>
                            <Label>Casbon</Label>
                        </Checkbox.Content>
                    </Checkbox>
                    <Checkbox isSelected={item.petty_cash}>
                        <Checkbox.Control>
                            <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Content>
                            <Label>Petty Cash</Label>
                        </Checkbox.Content>
                    </Checkbox>
                </div>
                <div className="flex flex-col gap-1">
                    <Description>Total Casbon</Description>
                    <Label>{formatRupiah(item.grand_total)}</Label>
                </div>
                <StatusChiper status={item.status} />
                <div className="">
                    <ModalComponent
                        size={'lg'}
                        heading={'Upload Bukti Trasnfer'}
                        state={state}
                        buttonTrigger={<Button isDisabled={item.total_expense >= item.grand_total} onPress={state.setOpen}>Actions</Button>}
                        hideFooter
                    >
                        <Surface className="py-1">
                            <Label>Telah dilakukan transfer untuk pengeluaran ...</Label>

                            <form action="" onSubmit={handleSubmit} className="mt-5 space-y-6">
                                <CurrencyInput value={form.amount} onChange={(e) => setForm({...form, amount: e})} label={'Nominal Transfer'} />
                                <CurrencyInput value={form.biaya_lainya} onChange={(e) => setForm({...form, biaya_lainya: e})} label={'Biaya Lain lain'} />
                                <div className="flex justify-end gap-2">
                                    <Button type="button" onPress={state.close} variant="tertiary">Close</Button>
                                    <Button type="submit">Submit</Button>
                                </div>
                            </form>
                        </Surface>
                    </ModalComponent>
                </div>
            </div>
            <div className="">
                <DownloadButton filename={file_name} fetch={async () => await api.get(`oprasional/casbon/${item.id}/preview/`,  {responseType: 'blob'})} />
                {/* <Button className={'bg-success'}>View Dok Fofin</Button> */}
            </div>
        </Card.Content>
    </Card>
  )
}

export default CasbonItem