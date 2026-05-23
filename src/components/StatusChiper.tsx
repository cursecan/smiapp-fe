import { Chip } from "@heroui/react"


const StatusChiper = ({status}) => {
    const master = {
        '': 'default',
        approval_manager: 'accent',
        disposisi_operasional: 'warning',
        progress_operasional: 'accent',
        selesai: 'success'
    }

    const result = status.replace(/_/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());

    const selected = master[status]
  
    return (
        <Chip color={selected}>{result || 'Inisiasi'}</Chip>
    )

}

export default StatusChiper