
import SelectComponent from './SelectComponent'
import { useQuery } from '@tanstack/react-query'
import { useKapalService } from "../../services/masterdata/kapalService"

const KapalSelect = ({value, onChange=()=>{}}) => {
    const {data} = useQuery({
        queryKey: ['kapal-list-select'],
        queryFn: async () => useKapalService.list({page: 0, limit:500, q: ''}),
        select: (data) => data.data.results.map(i => ({...i, label:i.nama_kapal}))
    })
    
  return (
    <SelectComponent value={value} onChange={onChange} label={'Kapal'} data={data} multiple />
  )
}

export default KapalSelect