import { Button, Label, ProgressBar, Spinner, useOverlayState } from "@heroui/react"
import ModalComponent from "../../../../../components/modals/ModalComponent"
import { Cloud } from "@gravity-ui/icons"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "../../../../../lib/api"
import {useState } from "react"

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
        onSuccess: () => {
            state.close()
            setProgress(0)
            qc.invalidateQueries({queryKey: ['doks-list-penawaran', data.id]})
        }
    })

    

  return (
    <div>
        <ModalComponent
            state={state}
            heading={'Upload Dokumen'}
            buttonTrigger={<Button isDisabled={!canEdit} onPress={state.setOpen}><Cloud /> Upload Dokumen</Button>}
            hideFooter
            // hideHeader
        >
            <div className="relative">
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
                
                {
                    mutation.isPending && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Spinner />
                        </div>
                    )
                }
            </div>

        </ModalComponent>
    </div>
  )
}

export default UploadDokumenModal