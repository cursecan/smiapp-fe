import { Rocket } from '@gravity-ui/icons'
import { Button, Modal } from '@heroui/react'

const ModalComponent = ({
    buttonTrigger,
    heading,
    children,
    iconComponent,
    footerComponent,
    state,
    size,
    hideFooter=false,
    disable=false
}) => {
  return (
    <Modal>
        { buttonTrigger }
        <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
            <Modal.Container size={size || 'sm'} scroll='outside'>
                <Modal.Dialog>
                    <Modal.CloseTrigger />
                    <Modal.Header>
                        {
                            iconComponent && (
                                <Modal.Icon>
                                    { iconComponent }
                                </Modal.Icon>
                            )
                        }
                        <Modal.Heading>{heading||'Modal Header'}</Modal.Heading>
                    </Modal.Header>
                    <Modal.Body>
                        { children }
                    </Modal.Body>
                    {
                        !hideFooter && (
                            <Modal.Footer>
                                {
                                    footerComponent ? footerComponent : (
                                        <Button slot={'close'}>
                                            Close
                                        </Button>

                                    )
                                }
                            </Modal.Footer>
                        )
                    }
                </Modal.Dialog>
            </Modal.Container>
        </Modal.Backdrop>
    </Modal>
  )
}

export default ModalComponent