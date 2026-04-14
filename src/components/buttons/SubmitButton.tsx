import { Button, useOverlayState } from "@heroui/react"
import ModalComponent from "../modals/ModalComponent"


const SubmitButton = ({
    icon,
    label,
    heading,
    children,
    handleSubmit
}) => {
    const state = useOverlayState()

  return (
    <ModalComponent
        state={state}
        buttonTrigger={<Button onPress={state.setOpen} className="bg-orange-500">{icon && icon}<span>{label || 'Submit'}</span></Button>}
        heading={heading}
        hideFooter
    >
        <div className="">
            {children}
            <div className="flex justify-end gap-2 mt-6">
                <Button variant="tertiary" slot={'close'}>Batal</Button>
                <Button onPress={handleSubmit}>Ajukan</Button>
            </div>
        </div>
    </ModalComponent>
  )
}

export default SubmitButton