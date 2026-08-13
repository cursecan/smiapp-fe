import { api } from "../../../../lib/api"
import { useState } from "react"
import SubmitButton from "../../../../components/buttons/SubmitButton"
import { useToast } from "../../../../lib/useToast"

const DownloadBAST = ({data, label}) => {
    const [isLoading, setIsLoading] = useState(false)
    const toast = useToast()
    
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
        } catch (err) {
            console.log(err.message);
            toast.danger({message: 'Failed Generate  Dok BA', description: err.message})

            
        }
        finally {
            setIsLoading(false)
        }
    }
    label

    return (
        // <Button variant="danger" onPress={handleDownload}>Generate BA</Button>
        <SubmitButton isLoading={isLoading} label={label} variant="primary"  onPress={handleDownload}/>
    )
}

export default DownloadBAST