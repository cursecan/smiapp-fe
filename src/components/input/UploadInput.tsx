import { ArrowDownToSquare, CloudArrowUpIn, File } from "@gravity-ui/icons"
import { Label, Spinner, Surface } from "@heroui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRef, useState } from "react"
import { useToast } from "../../lib/useToast"
import {api} from '../../lib/api'

const UploadInput = ({value, queryKey, pathUrl, name='Download Signed BA'}) => {
    const fileRef = useRef(null)
    const [progress, setProgress] = useState(0)

    const uploadFile = async (file, onProgress) => {
        const formData = new FormData()
        formData.append('file', file)


        const res = await api.post(pathUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (e) => {
                const percent = Math.round((e.loaded * 100) / e.total)
                onProgress(percent)
            }
        })

        return res.data
    }

    const qc = useQueryClient()

    const mutation = useMutation({
        mutationFn: async ({file, onProgress}) => {
            return await uploadFile(file, onProgress)
        },
        onSuccess: () => {
            setProgress(0)
            if (queryKey) {
                qc.invalidateQueries({queryKey: [...queryKey]})
            }
        }
    })

    const toast = useToast()

    const handleUpload = () => {      
        console.log(fileRef);
        
        const files = fileRef.current.files
        if (!files || files.length === 0) {
            toast.danger({message: 'Error', description: 'File cannot me empty.'})
            return
        }

        // if (form.item_penawaran.length === 0) {
        //     toast.danger({message: 'Error', description: "Reference kegiatan harus dipilih."})
        //     return
        // }
        mutation.mutate({file: fileRef.current.files[0], onProgress: setProgress})
    }


    

  return (
    <>
        { value ? (
            <div className="">
                <Surface className="h-32 flex items-center justify-center bg-warning-soft/20 border-2 rounded-xl border-dashed">
                    <a href={value} className="flex gap-1 text-sm items-center" target="_blank">
                        <ArrowDownToSquare className="size-5 text-blue-400" />
                        <span>{name}</span>
                    </a>
                </Surface>
            </div>
        ) : (
            <label>
                <input ref={fileRef} type="file" name="" id="" style={{display: 'none'}} onChange={handleUpload} />
                <Surface className="bg-warning-soft/50 border-2 border-dashed rounded-xl h-32 flex items-center justify-center">
                    <div className="">
                        <div className="flex justify-center">
                            {
                                mutation.isPending ? (
                                    <Spinner />
                                ) : (
                                    <CloudArrowUpIn className="size-6" />
                                )
                            }
                        </div>
                        <div className="text-center">
                            {
                                mutation.isPending ? (
                                    <Label>Uploading...</Label>
                                ) : (
                                    <Label>Import Dokumen BA</Label>
                                )
                            }
                        </div>
                    </div>
                </Surface>
            </label>
        )}
    </>
  )
}

export default UploadInput