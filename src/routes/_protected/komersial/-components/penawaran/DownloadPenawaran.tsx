import { Button, Link } from "@heroui/react"
import { api } from "../../../../../lib/api"

const DownloadPenawaran = ({data}) => {
    const handleDownload = async () => {
        const res = await api.get(`komersial/penawaran/${data.id}/dl/`, {responseType: 'blob'})
        const url = window.URL.createObjectURL(
            new Blob([res.data])
        )

        const link = document.createElement('a')

        link.href = url
        const filename = `${data?.nomor.replace('/', '.')}.pdf`
        link.setAttribute('download', filename)

        document.body.appendChild(link)

        link.click()
    }


    return (
        <>
            {
                data?.doc_pesanan ? (
                    <Link href={data?.doc_pesanan} target="_blank">Download Doc. Penawaran</Link>
                ) : (
                    <Button onPress={handleDownload}>Preview Penawaran</Button>
                )
            }
        </>
    )
}

export default DownloadPenawaran