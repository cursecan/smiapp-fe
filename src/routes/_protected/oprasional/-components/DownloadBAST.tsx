import { Button } from "@heroui/react"
import { api } from "../../../../lib/api"

const DownloadBAST = ({data}) => {
    const handleDownload = async () => {
        const res = await api.get(`oprasional/bast/${data}/download/`, {responseType: 'blob'})
        const url = window.URL.createObjectURL(
            new Blob([res.data])
        )

        const link = document.createElement('a')

        link.href = url
        const filename = `bast.pdf`
        link.setAttribute('download', filename)

        document.body.appendChild(link)

        link.click()
    }


    return (
        <Button variant="danger" onPress={handleDownload}>Download Berita Acara</Button>
    )
}

export default DownloadBAST