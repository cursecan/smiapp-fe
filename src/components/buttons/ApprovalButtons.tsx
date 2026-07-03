import { AlertDialog, Button, Description, Label, Surface, Switch, useOverlayState } from "@heroui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "../../lib/useToast"
import { useEffect, useState } from "react"
import InputText from "../input/InputText"


const ApprovalButtons = ({
    submitFn,
    saveFn,
    form,
    queryKey,
    isCanEdit=false,
    isCanApprove=false,
    noValidationSave=false,
    onError=()=>{}
}) => {
    const save_state = useOverlayState()
    const req_state = useOverlayState()
    const app_state = useOverlayState()

    const toast = useToast()

    const closeState = () => {
        save_state.close()
        req_state.close()
        app_state.close()
    }

    const qc = useQueryClient()

    const [appform, setAppForm] = useState({
        is_decline: false,
        message: ''
    })
    
    const save_mutation = useMutation({
        mutationFn: saveFn,
        onSuccess: () => {
            toast.success({message: 'Success.', description:'Data telah bershasil disimpan.'})
            if (queryKey) {
                qc.invalidateQueries({
                    queryKey: [...queryKey]
                })

            }
            closeState()
        },
        onError: (er) => {
            toast.danger({message: 'Gagal', description: er.message})
        }

    })

    const submit_mutation = useMutation({
        mutationFn: submitFn,
        onSuccess: () => {
            // toast.success()
            setAppForm({is_decline: false, message: ''})
            if (queryKey) {
                qc.invalidateQueries({
                    queryKey: [...queryKey]
                })
            }
            closeState()
        },
        onError: (er) => {
            toast.danger({message: 'Gagal', description: er.message})
            closeState()
        }
    })

    const handleSaveForm = (dataForm) => {
        save_mutation.mutate(dataForm)
    }


    const errorSave = (errors) => {
        if (noValidationSave) {
            const data = form.getValues()
            save_mutation.mutate(data)
            return
        }

        onError(errors)
    }

    const errorSubmit = (errors) => {
        console.log(errors, 'errors');
        console.log(form.getValues());
        
        
        alert('Harap lengkapi data dengan benar.')
        onError(errors)
        
    }

    const handleSubmitForm = () => {
        // console.log(dataForm, 'dataformss');
        submit_mutation.mutate({...appform, is_approve: !appform.is_decline})
    }

    useEffect(() => {
        if (!appform.is_decline) {
            setAppForm({...appform, message: ''})
        }

    }, [appform.is_decline])


  return (
    <div className="flex items-center gap-3">
        {
            isCanEdit && (
                <>
                    <AlertDialog>
                        <Button isDisabled={false} onPress={save_state.setOpen}>Simpan</Button>
                        <AlertDialog.Backdrop isOpen={save_state.isOpen} onOpenChange={save_state.setOpen}>
                            <AlertDialog.Container>
                                <AlertDialog.Dialog>
                                    <AlertDialog.CloseTrigger />
                                    <AlertDialog.Header>
                                        <AlertDialog.Icon status="warning" />
                                        <AlertDialog.Heading>Simpan</AlertDialog.Heading>
                                    </AlertDialog.Header>
                                    <AlertDialog.Body>
                                        <div className="">
                                            Apakah Anda yakin menyimpan perubahan data ini?
                                        </div>
                                    </AlertDialog.Body>
                                    <AlertDialog.Footer>
                                        <Button slot={'close'} variant="tertiary">Close</Button>
                                        <Button isDisabled={save_mutation.isPending} onPress={form.handleSubmit(handleSaveForm, errorSave)}>Ya, Simpan</Button>
                                    </AlertDialog.Footer>
                                </AlertDialog.Dialog>
                            </AlertDialog.Container>
                        </AlertDialog.Backdrop>
                    </AlertDialog>
                    {
                        !isCanApprove && (
                            <AlertDialog>
                                <Button isDisabled={false} className={'bg-orange-500'} onPress={req_state.setOpen}>Ajukan</Button>
                                <AlertDialog.Backdrop isOpen={req_state.isOpen} onOpenChange={req_state.setOpen}>
                                    <AlertDialog.Container>
                                        <AlertDialog.Dialog>
                                            <AlertDialog.CloseTrigger />
                                            <AlertDialog.Header>
                                                <AlertDialog.Icon status="success" />
                                                <AlertDialog.Heading>Pengajuan Approval</AlertDialog.Heading>
                                            </AlertDialog.Header>
                                            <AlertDialog.Body>
                                                <div className="">
                                                    Apakah kamu yakin mau mangajukan proses aprroval ke tahap selanjutnya?
                                                </div>
                                            </AlertDialog.Body>
                                            <AlertDialog.Footer>
                                                <Button slot={'close'} variant="tertiary">Close</Button>
                                                <Button isDisabled={submit_mutation.isPending} onPress={form.handleSubmit(handleSubmitForm, errorSubmit)}>Ya, Lanjutkan</Button>
                                            </AlertDialog.Footer>
                                        </AlertDialog.Dialog>
                                    </AlertDialog.Container>
                                </AlertDialog.Backdrop>
                            </AlertDialog>
                        )
                    }
                </>
            )
        }
        {
            isCanApprove && (
                <AlertDialog>
                    <Button isDisabled={false} className={'bg-orange-500'} onPress={req_state.setOpen}>Approval</Button>
                    <AlertDialog.Backdrop isOpen={req_state.isOpen} onOpenChange={req_state.setOpen}>
                        <AlertDialog.Container>
                            <AlertDialog.Dialog>
                                <AlertDialog.CloseTrigger />
                                <AlertDialog.Header>
                                    <AlertDialog.Icon status="success" />
                                    <AlertDialog.Heading>Approval Process</AlertDialog.Heading>
                                </AlertDialog.Header>
                                <AlertDialog.Body>
                                    <div className="px-1 space-y-3">
                                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus, quidem?</p>
                                        <div className="">
                                            <Switch isSelected={appform.is_decline} onChange={(e) => setAppForm({...appform, is_decline: e})}>
                                                <Switch.Control className={appform.is_decline ? 'bg-danger' : ''} >
                                                    <Switch.Thumb />
                                                </Switch.Control>
                                                <Switch.Content>
                                                    <Label>Decline Approval</Label>
                                                    <Description>Lorem ipsum dolor sit amet.</Description>
                                                </Switch.Content>
                                            </Switch>
                                        </div>
                                        {
                                            appform.is_decline && (
                                                <Surface variant="secondary" className="p-3 rounded-xl mt-4">
                                                    <InputText value={appform.message} onChange={(e) => setAppForm({...appform, message: e.target.value})} label={'Catatan'} />
                                                </Surface>

                                            )
                                        }
                                    </div>
                                </AlertDialog.Body>
                                <AlertDialog.Footer>
                                    {/* <Button slot={'close'} variant="tertiary">Close</Button> */}
                                    <Button variant="tertiary" slot={'close'}>Close</Button>
                                    <Button variant={appform.is_decline ? 'danger' : 'primary'} onPress={form.handleSubmit(handleSubmitForm, errorSubmit)}>Submit</Button>
                                </AlertDialog.Footer>
                            </AlertDialog.Dialog>
                        </AlertDialog.Container>
                    </AlertDialog.Backdrop>
                </AlertDialog>
            )
        }
    </div>
  )
}

export default ApprovalButtons