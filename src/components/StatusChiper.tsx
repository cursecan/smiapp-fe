import { Chip } from "@heroui/react"


const StatusChiper = ({status}) => {
    const master = {
        inisiasi: 'default',
        approval_manager: 'accent',
        selesai: 'success'
    }

    const clean_status = status.replace(/\s+/g, "_").toLowerCase()
    const selected = master[clean_status]
  
    return (
        <Chip color={selected}>{status}</Chip>
    )

}

export default StatusChiper