import { AlertDialog, Button } from "@heroui/react"

const AlertDialogModal = ({state, header, children, hideFooter=false, hideHeader=false, noCloseIcon=false}) => {
    return (
        <AlertDialog>
            {/* <Button variant="danger">Delete Project</Button> */}
            <AlertDialog.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
                <AlertDialog.Container>
                    <AlertDialog.Dialog className="sm:max-w-100">
                        { !noCloseIcon && <AlertDialog.CloseTrigger />}
                        {
                            !hideHeader && (
                                <AlertDialog.Header>
                                    <AlertDialog.Icon status="danger" />
                                    <AlertDialog.Heading>{header}</AlertDialog.Heading>
                                </AlertDialog.Header>
                            )
                        }
                        <AlertDialog.Body>
                            {children}
                        </AlertDialog.Body>
                        {
                            !hideFooter && (
                                <AlertDialog.Footer>
                                    <Button slot="close" variant="tertiary">
                                        Cancel
                                    </Button>
                                    <Button slot="close" variant="danger">
                                        Delete Project
                                    </Button>
                                </AlertDialog.Footer>
                            )
                        }
                    </AlertDialog.Dialog>
                </AlertDialog.Container>
            </AlertDialog.Backdrop>
            </AlertDialog>
    )
}

export default AlertDialogModal