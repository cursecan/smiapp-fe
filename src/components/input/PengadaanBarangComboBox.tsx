import { useQuery } from "@tanstack/react-query"
import { useJenisPekerjaanService } from "../../services/masterdata/jenisPekerjaanService"
import ComboBoxComponent from "./ComboBoxComponent"

const PengadaanBarangComboBox = ({value, onChange=()=>{}, ...props}) => {
    const fnQuery = async (pageParam, queryKey) => useJenisPekerjaanService.list({pageParam, queryKey})
    console.log(value, 'valvalvava');
    
    const {data:selectedData, isLoading} = useQuery({
        queryKey: ['jenispekerjaan-detail-combox', value],
        queryFn: async () => {
            return await useJenisPekerjaanService.detail(value)
        },
        select: (res) => {
            const data=res.data
            return {...data, name: data.jenis_pekerjaan}
        },
        enabled: !!value
    })

    if (isLoading) {
        return null
    }

  return (
    <ComboBoxComponent
        label={'Jenis Pekerjaan'}
        fnQuery={fnQuery}
        keyName={'pekerjaan-jenis-list-combox'}
        filter={(i) => ({...i, name: i.jenis_pekerjaan})}
        onChange={onChange}
        value={selectedData}
        {...props}
    />
  )
}

export default PengadaanBarangComboBox