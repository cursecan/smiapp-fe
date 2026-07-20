import { Button } from "@heroui/react"
import { api } from "../../../../lib/api"
import { useState } from "react"
import SubmitButton from "../../../../components/buttons/SubmitButton"

const DownloadBAST = ({data}) => {
    const [isLoading, setIsLoading] = useState(false)
    
    const handleDownload = async () => {
        try {

            setIsLoading(true)
            const res = await api.get(`oprasional/bast/${data}/download/`, {responseType: 'blob'})
            const url = window.URL.createObjectURL(
                new Blob([res.data])
            )
    
            const link = document.createElement('a')
    
            link.href = url
            const filename = `${data}.pdf`
            link.setAttribute('download', filename)
    
            document.body.appendChild(link)
    
            link.click()
        } finally {
            setIsLoading(false)
        }
    }


    return (
        // <Button variant="danger" onPress={handleDownload}>Generate BA</Button>
        <SubmitButton isLoading={isLoading} label="Generate BA" variant="danger"  onPress={handleDownload}/>
    )
}

export default DownloadBAST