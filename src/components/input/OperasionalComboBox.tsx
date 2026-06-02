import { useQuery } from "@tanstack/react-query"
import { useOprasionalService } from "../../services/oprasional/oprasionalService"
import ComboBoxComponent from "./ComboBoxComponent"

const OperasionalComboBox = ({value, label="Pekerjaan", onChange=()=>{}, ...props}) => {
    const fnQuery = (pageParam, queryKey) => useOprasionalService.active_list({pageParam, queryKey})

    const { data:selectedPekerjaan, isLoading } = useQuery({
        queryKey: ['opr_detail_cb', value],
        queryFn: async () => {
            return await useOprasionalService.detail(value)
        }, 
        select: (res) => {
            const data = res.data
            // setPelabuhan(data)
            return {...data, name: data.nama_pelabuhan}
        },
        enabled: !!value
    })

    if (isLoading) {
        return null
    }
    
  return (
    <ComboBoxComponent
        label={label}
        fnQuery={fnQuery}
        keyName={'opr-list-combox'}
        filter={(i) => ({...i, name: i.pekerjaan})}
        onChange={onChange}
        value={selectedPekerjaan}
        {...props}
    />
  )
}

export default OperasionalComboBox