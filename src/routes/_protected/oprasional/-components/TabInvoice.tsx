import { Surface, Tabs } from "@heroui/react"
import UploadInput from "../../../../components/input/UploadInput"
import DownloadButton from "../../../../components/buttons/DownloadButton"

const TabInvoice = ({opr, canEdit=false}) => {
  return (
    <Tabs.Panel id={'invoice'}>
        <Surface className="space-y-6">
            <UploadInput value={'dada'} name="Download Invoice" />
            <UploadInput value={'dada'} name="Kwitansi" />
            <UploadInput value={'dada'} name="BA kesepakatan" />

            <DownloadButton filename={'invoice.pdf'} label="Dowbload Invoice" urlFetch={`/invoice/invoice/${opr?.invoice}/download/`} />
            <DownloadButton filename={'ba_kesepakatan.pdf'} label="Dowbload Ba Kesepakatan" urlFetch={`/invoice/invoice/${opr?.invoice}/ba/`} />
        </Surface>
    </Tabs.Panel>
  )
}

export default TabInvoice