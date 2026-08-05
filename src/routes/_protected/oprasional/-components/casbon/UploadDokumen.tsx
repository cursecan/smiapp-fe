import { CloudArrowUpIn, File, LayoutTabs } from "@gravity-ui/icons"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRef, useState } from "react"
import { api } from '../../../../../lib/api'
import { CloseButton, Spinner } from "@heroui/react"


const UploadDokumen = ({patUrl, canEdit=false, value=null, queryKey=[], onDelete=() => {}}) => {
    const [progress, setProgress] = useState(0)
    const fileRef = useRef(null)
    const qc = useQueryClient()

    const uploadFile = async (file, onProgress) => {
        const formData = new FormData()
        formData.append('file', file)

        const res = await api.post(patUrl, formData, {
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


    const mutation = useMutation({
        mutationFn: async ({file, onProgress}) => {
            return await uploadFile(file, onProgress)
        },
        onSuccess: () => {
            setProgress(0)
            qc.invalidateQueries({queryKey})
        }
    })

    return (
        <div className="flex mt-3">
            {
                value ? (
                    <div className=" drop-shadow-lg relative w-16 h-16 bg-green-300 text-white rounded-xl flex items-center justify-center">
                        <LayoutTabs className="size-12" />
                        <a href={value} target="_blank" className="absolute inset-0"></a>
                        {
                            canEdit && (
                                <div className="absolute -top-3 -right-3">
                                    <CloseButton onPress={onDelete} className={'bg-danger text-white'} />
                                </div>
                            )
                        }
                    </div>
                ) : (
                    <label htmlFor="upfile" className="w-16 h-16 bg-amber-400/5 rounded-xl border-dashed border-2 flex items-center justify-center">
                        {
                            mutation.isPending ? <Spinner /> : <CloudArrowUpIn />
                        }
                        <input id="upfile" type="file" ref={fileRef} className="hidden" onChange={(e) => {mutation.mutate({file: e.target.files[0], onProgress: setProgress})}} />
                    </label>
                )
            }
        </div>
    )
}

export default UploadDokumen