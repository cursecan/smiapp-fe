import { Button } from "@heroui/react"
import {api} from '../../lib/api'
import { useState } from "react"
import SubmitButton from "./SubmitButton"
import { CloudArrowUpIn } from "@gravity-ui/icons"

const DownloadButton = ({filename, urlFetch, label="Review Button",}) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleDownload = async () => {
        try {
            setIsLoading(true)
            
            const res = await api.get(urlFetch, {responseType: 'blob'})
           // const res = await fetch()
            const url = window.URL.createObjectURL(
                new Blob([res.data])
            )
    
            const link = document.createElement('a')
    
            link.href = url
            link.setAttribute('download', filename)
    
            document.body.appendChild(link)
    
            link.click()
        } finally {
            setIsLoading(false)
        }
     }
 
 
     return (
        //  <Button  variant="danger-soft" onPress={handleDownload}>{label}</Button>
        <SubmitButton icon={<CloudArrowUpIn />} label={label} onPress={handleDownload} isLoading={isLoading} />
     )
 }

export default DownloadButton