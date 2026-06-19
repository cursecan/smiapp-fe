import { Button, Label, ProgressBar, Spinner, Table, TableScrollContainer, useOverlayState } from "@heroui/react"
import ModalComponent from "../../../../../components/modals/ModalComponent"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCasbonService } from "../../../../../services/oprasional/casbonService"
import { ArrowChevronRight } from "@gravity-ui/icons"
import { useState } from "react"
import {api} from '../../../../../lib/api'

const UploadTagihanModal = ({casbon, canEdit}) => {
    const state = useOverlayState()
    const [progress, setProgress] = useState(0)

    const {data: tagihans, isLoading} = useQuery({
        queryKey: ['file-tagihan-list', casbon.id],
        queryFn: () => useCasbonService.tagihan_files(casbon.id),
        select: (res) => res.data,
        enabled: !!casbon.id && !!state.isOpen
    })

    const qc = useQueryClient()

    const uploadFile = async (file, onProgress) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('casbon', casbon.id)

        const res = await api.post('oprasional/tagihan-file/', formData, {
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
            qc.invalidateQueries({queryKey: ['file-tagihan-list', casbon.id]})
        }
    })

    // if (isLoading) {
    //     return <div className="">Loading</div>
    // }


    return (
    <ModalComponent heading={'Dokumen Tagihan / Billing'} state={state} buttonTrigger={<Button onPress={state.setOpen} variant="secondary">Dokumen Tagihan</Button>}>
        <div className="">
            <Table>
                <TableScrollContainer>
                    <Table.Content>
                        <Table.Header>
                            <Table.Column isRowHeader>Tagihan</Table.Column>
                            <Table.Column></Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {
                                tagihans?.map(i => {
                                    return (
                                        <Table.Row key={i.id}>
                                            <Table.Cell>{i.file_name}</Table.Cell>
                                            <Table.Cell>
                                                <a href={i.file_path} target="_blank" className="flex items-center text-blue-500 gap-1">
                                                    Download
                                                    <ArrowChevronRight />
                                                </a>
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                })
                            }
                        </Table.Body>
                    </Table.Content>
                </TableScrollContainer>
            </Table>

            {
                canEdit && (
                    <div className="relative mt-6">
                        <div className="mb-3">Upload Billing & Invoice</div>
                        <div className="mb-1">
                            <Label>Accepted document only .pdf & image</Label>
                        </div>
                        <div className="">
                            <input className="border-2 w-full p-2 border-dashed" type="file" onChange={(e) => {mutation.mutate({file: e.target.files[0], onProgress: setProgress})}} />
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

                )
            }

        </div>
    </ModalComponent>
  )
}

export default UploadTagihanModal