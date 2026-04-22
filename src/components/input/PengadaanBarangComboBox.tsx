import { useJenisPekerjaanService } from "../../services/masterdata/jenisPekerjaanService"
import ComboBoxComponent from "./ComboBoxComponent"

const PengadaanBarangComboBox = ({value, onChange=()=>{}, ...props}) => {
    const fnQuery = async (pageParam, queryKey) => useJenisPekerjaanService.list({pageParam, queryKey})
  return (
    <ComboBoxComponent
        label={'Jenis Pekerjaan'}
        fnQuery={fnQuery}
        keyName={'pekerjaan-jenis-list-combox'}
        filter={(i) => ({...i, name: i.jenis_pekerjaan})}
        onChange={onChange}
        value={value}
        {...props}
    />
  )
}

export default PengadaanBarangComboBox