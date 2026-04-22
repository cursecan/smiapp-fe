
import { useWilayahService } from '../../services/masterdata/wilayahService'
import ComboBoxComponent from './ComboBoxComponent'

const WilayahComboBox = ({value, onChange=()=>{}, ...props}) => {
    const fnQuery = async (pageParam, queryKey) => useWilayahService.list({pageParam, queryKey})
    
  return (

    <ComboBoxComponent
        label={'Wilayah'}
        fnQuery={fnQuery}
        keyName={'wilayah-list-combox'}
        filter={(i) => ({...i, name: i.lokasi})}
        onChange={onChange}
        value={value}
        {...props}
    />
  )
}

export default WilayahComboBox