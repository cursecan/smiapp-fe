import { Button, useOverlayState } from "@heroui/react"
import ModalComponent from "../../../../components/modals/ModalComponent"
import RichTextEditor from "../../../../components/input/RichTextEditor"


const KwitansiModal = ({data}) => {
  const state = useOverlayState()

    
    return (
        <ModalComponent
            hideHeader
            state={state}
            buttonTrigger={<Button fullWidth onPress={state.open}>Kwitansi</Button>}
            size={'xl'}
        >

            <div className="flex justify-center">
                {/* <div className="w-[210mm]"> */}
                    <RichTextEditor content={data?.kwitansi_html} />

                {/* </div> */}
            </div>
        </ModalComponent>
    )
}

export default KwitansiModal