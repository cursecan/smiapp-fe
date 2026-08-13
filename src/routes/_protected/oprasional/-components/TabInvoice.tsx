import { Surface, Tabs } from "@heroui/react"
import UploadInput from "../../../../components/input/UploadInput"
import DownloadButton from "../../../../components/buttons/DownloadButton"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useInvoiceService } from "../../../../services/invoice/invoiceService"
import SubmitButton from "../../../../components/buttons/SubmitButton"

const TabInvoice = ({opr, canEdit=false}) => {
  const qc = useQueryClient()

  const { data: inv} = useQuery({
    queryKey: ['detail_inv', opr?.invoice],
    queryFn: () => useInvoiceService.detail(opr?.invoice),
    select: (res) => res.data,
    enabled: !!opr?.invoice
  })


  return (
    <Tabs.Panel id={'invoice'}>
        <Surface className="space-y-6 flex flex-col">
            <UploadInput value={inv?.dok_1} name="Invoice" disableInput />
            <UploadInput value={inv?.dok_2} name="Kwitansi" disableInput />
            <UploadInput value={inv?.dok_3} name="BA kesepakatan" disableInput />

            {/* <DownloadButton filename={'invoice.pdf'} label="Dowbload Invoice" urlFetch={`/invoice/invoice/${opr?.invoice}/download/`} />
            <DownloadButton filename={'ba_kesepakatan.pdf'} label="Dowbload Ba Kesepakatan" urlFetch={`/invoice/invoice/${opr?.invoice}/ba/`} /> */}

            <SubmitButton isLoading={inv?.isLoading} onPress={() => qc.invalidateQueries({queryKey:['detail_inv']})} label="Refresh" />
        </Surface>
    </Tabs.Panel>
  )
}

export default TabInvoice