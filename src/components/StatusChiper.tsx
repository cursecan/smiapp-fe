import { CircleFill } from "@gravity-ui/icons";
import { Chip } from "@heroui/react"


const StatusChiper = ({status}) => {
    const master = {
        '': {color: 'default', variant: 'primary'},
        approval_manager: {color: 'accent', variant: 'soft'},
        disposisi_operasional: {color: 'accent', variant: 'primary'},
        progress_operasional: {color: 'success', variant: 'soft'},
        selesai: {color: 'success', variant: 'primary'}
    }

    const result = status.replace(/_/g, " ")
        .replace(/\b\w/g, c => c.toUpperCase());

    const selected = master[status]
  
    return (
        <Chip variant={selected?.variant} color={selected?.color}>
            <CircleFill width={6} />
            <Chip.Label>{result || 'Inisiasi'}</Chip.Label>
        </Chip>
    )

}

export default StatusChiper