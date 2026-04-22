import { AlertDialog, Button, useOverlayState } from "@heroui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"


const ApprovalButtons = ({
    submitFn,
    saveFn,
    form,
    handleSubmit,
    queryKey,
    isCanEdit=false,
    isCanApprove=false,
    beforeSubmit=()=>{}
}) => {
    const save_state = useOverlayState()
    const req_state = useOverlayState()
    const app_state = useOverlayState()

    const closeState = () => {
        save_state.close()
        req_state.close()
        app_state.close()
    }

    const qc = useQueryClient()
    
    const save_mutation = useMutation({
        mutationFn: saveFn,
        onSuccess: (res) => {
            if (queryKey) {
                qc.invalidateQueries({
                    queryKey: [...queryKey]
                })

            }
            closeState()
        }
    })

    const submit_mutation = useMutation({
        mutationFn: submitFn,
        onSuccess: (res) => {
            if (queryKey) {
                qc.invalidateQueries({
                    queryKey: [...queryKey]
                })

            }
            closeState()
        }
    })

    const handleSaveForm = (dataForm) => {
        if (beforeSubmit) {
            beforeSubmit()
        }
        save_mutation.mutate(dataForm)
    }

    const handleSubmitForm = (dataForm) => {
        if (beforeSubmit) {
            beforeSubmit()
        }
        submit_mutation.mutate(dataForm)
    }

    


  return (
    <div className="flex items-center gap-3">
        {
            isCanEdit && (
                <>
                    <AlertDialog>
                        <Button onPress={save_state.setOpen}>Simpan</Button>
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
                                        <Button onPress={handleSubmit(handleSaveForm)}>Ya, Simpan</Button>
                                    </AlertDialog.Footer>
                                </AlertDialog.Dialog>
                            </AlertDialog.Container>
                        </AlertDialog.Backdrop>
                    </AlertDialog>
                    <AlertDialog>
                        <Button className={'bg-orange-500'} onPress={req_state.setOpen}>Ajukan</Button>
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
                                        <Button onPress={handleSubmit(handleSubmitForm)}>Ya, Lanjutkan</Button>
                                    </AlertDialog.Footer>
                                </AlertDialog.Dialog>
                            </AlertDialog.Container>
                        </AlertDialog.Backdrop>
                    </AlertDialog>
                </>
            )
        }
    </div>
  )
}

export default ApprovalButtons