import { Button, Label, ProgressBar, useOverlayState } from "@heroui/react"
import ModalComponent from "../../../../../components/modals/ModalComponent"
import { Cloud } from "@gravity-ui/icons"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useUploadDokumenService } from "../../../../../services/komersial/uploadDokumenService"

import { api } from "../../../../../lib/api"
import { useEffect, useState } from "react"

import { useDropzone } from 'react-dropzone'

const UploadDokumenModal = ({data, canEdit=false}) => {
    const state = useOverlayState()
    const [progress, setProgress] = useState(0)
    const qc = useQueryClient()

    const uploadFile = async (file, onProgress) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('penawaran_id', data.id)

        const res = await api.post('/komersial/upload-dokumen/', formData, {
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
        onSuccess: (res) => {
            state.close()
            setProgress(0)
            qc.invalidateQueries({queryKey: ['doks-list-penawaran', data.id]})
        }
    })

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            // handleUpload(acceptedFiles[0])
            console.log(acceptedFiles);
            
        }
    })

    useEffect(() => {
        setProgress(0)
    }, [])

    

  return (
    <div>
        <ModalComponent
            state={state}
            heading={'Upload Dokumen'}
            buttonTrigger={<Button isDisabled={!canEdit} onPress={state.setOpen}><Cloud /> Upload Dokumen</Button>}
            hideFooter
            // hideHeader
        >
            <div className="">
                <div className="mb-1">
                    <Label>Accepted document only .pdf & image</Label>
                </div>
                <div className="">
                    <input className="border-2 w-full p-2 border-dashed" type="file" onChange={(e) => {console.log(e.target.files); mutation.mutate({file: e.target.files[0], onProgress: setProgress})}} />
                </div>
                
                {
                    progress >0 && (
                        <ProgressBar value={progress}>
                            <ProgressBar.Output />
                            <ProgressBar.Track>
                                <ProgressBar.Fill />
                            </ProgressBar.Track>
                        </ProgressBar>

                    )
                }
                {/* <div className="">
                    {progress} %
                </div> */}
                {/* <div {...getRootProps()} className="p-6 border-2 rounded-2xl border-dashed bg-amber-50">
                    <input {...getInputProps()} />
                    <div className="text-center">
                        <div className="flex items-center justify-center">
                            <Cloud className="size-5" />
                        </div>
                        <div className="mt-2">
                            Drag and drop file here.
                        </div>
                    </div>
                </div> */}
            </div>

        </ModalComponent>
    </div>
  )
}

export default UploadDokumenModal