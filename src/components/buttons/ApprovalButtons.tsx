import { AlertDialog, Button, useOverlayState } from "@heroui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "../../lib/useToast"


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
        // console.log(errors, 'errors');
        
        alert('Harap lengkapi data dengan benar.')
        onError(errors)
        
    }

    const handleSubmitForm = (dataForm) => {
        // console.log(dataForm, 'dataformss');
        
        submit_mutation.mutate(dataForm)
    }


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
                                    <AlertDialog.Heading>Approval</AlertDialog.Heading>
                                </AlertDialog.Header>
                                <AlertDialog.Body>
                                    <div className="">
                                        Apakah kamu yakin menyetujui permintaan aproval data tersebut?
                                    </div>
                                </AlertDialog.Body>
                                <AlertDialog.Footer>
                                    {/* <Button slot={'close'} variant="tertiary">Close</Button> */}
                                    <Button variant="danger" slot={'close'}>Tolak</Button>
                                    <Button onPress={form.handleSubmit(handleSubmitForm, errorSubmit)}>Setujui</Button>
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