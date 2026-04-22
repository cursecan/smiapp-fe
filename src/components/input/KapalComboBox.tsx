
import { useKapalService } from '../../services/masterdata/kapalService'
import ComboBoxComponent from './ComboBoxComponent'

const KapalComboBox = ({value, onChange=()=>{}}) => {
    const fnQuery = async (pageParam, queryKey) => useKapalService.list({pageParam, queryKey})
    
  return (

    <ComboBoxComponent
        label={'Kapal'}
        fnQuery={fnQuery}
        keyName={'kapal-list-combox'}
        filter={(i) => ({...i, name: i.nama_kapal})}
        onChange={onChange}
        value={value}
    />
  )
}

export default KapalComboBox