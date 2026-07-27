import { Surface, Tabs } from "@heroui/react"
import UploadInput from "../../../../components/input/UploadInput"

const TabInvoice = ({opr, canEdit=false}) => {
  return (
    <Tabs.Panel id={'invoice'}>
        <Surface className="space-y-6">
            <UploadInput value={'dada'} name="Download Invoice" />
            <UploadInput value={'dada'} name="Faktur Pajak" />
        </Surface>
    </Tabs.Panel>
  )
}

export default TabInvoice