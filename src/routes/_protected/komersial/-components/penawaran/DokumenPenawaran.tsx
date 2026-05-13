
import { Label, Surface, Table } from '@heroui/react'
import DokumenFileItem from './DokumenFileItem'
import UploadDokumenModal from './UploadDokumenModal'
import { useQuery } from '@tanstack/react-query'
import { usePenawaranService } from '../../../../../services/penawaran.service'

const DokumenPenawaran = ({data, canEdit=false}) => {
    const {data:docs} = useQuery({
        queryKey: ['doks-list-penawaran', data.id],
        queryFn: async () => {
            return usePenawaranService.documents(data.id)
        },
        select: (data) => data.data,
        enabled: !!data.id
    })


  return (
    <Surface className='rounded-2xl p-3'>
    <div className="flex items-center justify-between">
        <Label className='text-lg font-semibold'>Dokumen Pendukung</Label>
        <UploadDokumenModal canEdit={canEdit} data={data}  />
    </div>
    <Table className='mt-3'>
        <Table.ScrollContainer>
        <Table.Content>
            <Table.Header>
            <Table.Column isRowHeader>
                No
            </Table.Column>
            <Table.Column>
                File
            </Table.Column>
            <Table.Column>
                Dokumen Type
            </Table.Column>
            <Table.Column></Table.Column>
            </Table.Header>
            <Table.Body>
            {
                docs?.map((i, index) => {
                return (
                    <DokumenFileItem canEdit={canEdit} item={{...i, index:index}} key={index} />
                )
                })
            }
            </Table.Body>
        </Table.Content>
        </Table.ScrollContainer>
    </Table>
    </Surface>

  )
}

export default DokumenPenawaran