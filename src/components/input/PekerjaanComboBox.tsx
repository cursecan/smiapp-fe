import { useQuery } from "@tanstack/react-query"
import ComboBoxComponent from "./ComboBoxComponent"
import { usePekerjaanService } from "../../services/masterdata/pekerjaanService"

const PekerjaanComboBox = ({label, value, onChange=()=>{}, ...props}) => {
    const fnQuery = (pageParam, queryKey) => usePekerjaanService.list({queryKey})

    const {data: selectedData, isLoading} = useQuery({
      queryKey: [`pekerjaan-detail-combox${value}`, value],
      queryFn: async () => {
        return await usePekerjaanService.detail(value)
      },
      select: (res) => {
        const data = res.data
        return {...data, name: `${data.nama_pekerjaan}`}
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
        keyName={'customer-list-combox'}
        filter={(i) => ({...i, name: `${i.nama_pekerjaan}`})}
        onChange={onChange}
        value={selectedData}
        className={'w-100'}
        {...props}
    />
  )
}

export default PekerjaanComboBox