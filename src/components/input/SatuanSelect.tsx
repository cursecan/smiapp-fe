import { useQuery } from "@tanstack/react-query"
import SelectComponent from "./SelectComponent"
import { useSatuanService } from "../../services/masterdata/satuanService"


const SatuanSelect = ({disable, label, value, onChange=()=>{}}) => {
    const {data, isLoading} = useQuery({
        queryKey: ['satua-list-select'],
        queryFn: () => useSatuanService.list(),
        select: (res) => res.data.results.map(i => ({...i, label: i.nama_satuan}))
    })

    if (isLoading) {
        return null
    }

    

  return (
    <SelectComponent placeholder="Satuan" disable={disable} value={value} onChange={onChange} label={label || 'Customer'} data={data} />
  )
}

export default SatuanSelect