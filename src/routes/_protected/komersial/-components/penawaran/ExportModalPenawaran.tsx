import { Button, Surface, useOverlayState } from "@heroui/react"
import ModalComponent from "../../../../../components/modals/ModalComponent"
import DateInput from "../../../../../components/input/DateInput"
import { useState } from "react"
import { parseDate, today, getLocalTimeZone, startOfMonth, endOfMonth } from '@internationalized/date'
import { api} from '../../../../../lib/api'
import SubmitButton from "../../../../../components/buttons/SubmitButton"

const ExportModalPenawaran = () => {
    const state = useOverlayState()
    const currDate = today(getLocalTimeZone())
    const [isLoading, setIsLoading] = useState(false)

    const [form, setForm] = useState({
        startDate: startOfMonth(currDate),
        endDate: endOfMonth(currDate)
    })


    const handleDownload = async () => {
        try {
            setIsLoading(true)
            
            const res = await api.get('/komersial/download-penawaran/', {params:{...form}, responseType: 'blob'})
            // const res = await fetch()
            const url = window.URL.createObjectURL(
                new Blob([res.data])
            )
    
            const link = document.createElement('a')
    
            link.href = url
            link.setAttribute('download', 'export-penawaran.xlsx')
    
            document.body.appendChild(link)
    
            link.click()
        } finally {
            setIsLoading(false)
            state.close()
        }
    }


  
    return (
        <ModalComponent
            hideFooter
            hideHeader
            state={state}
            size={'lg'}
            buttonTrigger={<Button className={' bg-success text-white'} onPress={state.open}>Export Excel</Button>}
        >
            <Surface className="my-2">
                <div className="">Export to Excel For Range</div>
                <div className="flex items-center justify-between mt-6">
                    <DateInput value={form.startDate} label={'Tanggal Awal'} onChange={(e) => setForm({...form, startDate: parseDate(e)})} />
                    <DateInput value={form.endDate} label={'Tanggal Akhir'} onChange={(e) => setForm({...form, endDate: parseDate(e)})} />
                </div>
                <div className="flex justify-end mt-6">
                    <SubmitButton isLoading={isLoading} label="Export Excel" onPress={handleDownload} />
                </div>
            </Surface>
        </ModalComponent>
  )
}

export default ExportModalPenawaran