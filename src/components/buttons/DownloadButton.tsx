import { Button } from "@heroui/react"

const DownloadButton = ({filename, fetch=()=>{}}) => {
 const handleDownload = async () => {
        //  const res = await api.get(`komersial/penawaran/${data.id}/dl/`, {responseType: 'blob'})
        const res = await fetch()
         const url = window.URL.createObjectURL(
             new Blob([res.data])
         )
 
         const link = document.createElement('a')
 
         link.href = url
         link.setAttribute('download', filename)
 
         document.body.appendChild(link)
 
         link.click()
     }
 
 
     return (
         <Button onPress={handleDownload}>Download</Button>
     )
 }

export default DownloadButton