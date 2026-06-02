
import { useKapalService } from '../../services/masterdata/kapalService'
import ComboBoxComponent from './ComboBoxComponent'

const KapalComboBox = ({label, value, onChange=()=>{}}) => {
  const fnQuery = async (pageParam, queryKey) => useKapalService.list({pageParam, queryKey})
    
  return (

    <ComboBoxComponent
        label={label}
        fnQuery={fnQuery}
        keyName={'kapal-list-combox'}
        filter={(i) => ({...i, name: i.nama_kapal})}
        onChange={onChange}
        value={value}
    />
  )
}

export default KapalComboBox