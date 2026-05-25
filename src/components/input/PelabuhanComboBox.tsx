
import { useQuery } from "@tanstack/react-query"
import { usePelabuhanService } from "../../services/masterdata/pelabuhanService"
import ComboBoxComponent from "./ComboBoxComponent"


const PelabuhanComboBox = ({label, value, onChange=()=>{}, setPelabuhan, ...props}) => {
    // const [pageParam, setPageParam] = useState(1)
    
    const fnQuery = (pageParam, queryKey) => usePelabuhanService.list({pageParam, queryKey})

    const { data:selectedPelabuhan, isLoading } = useQuery({
        queryKey: ['pelabuhan', value],
        queryFn: async () => {
            return await usePelabuhanService.detail(value)
        }, 
        select: (res) => {
            const data = res.data
            setPelabuhan(data)
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
        keyName={'pelabuhan-list-combox'}
        filter={(i) => ({...i, name: i.nama_pelabuhan})}
        onChange={onChange}
        value={selectedPelabuhan}
        {...props}
    />
  )
}

export default PelabuhanComboBox