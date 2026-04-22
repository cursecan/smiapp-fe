

import ComboBoxComponent from './ComboBoxComponent'
import { usePenawaranService } from '../../services/penawaran.service'


const PenawaranComboBox = ({value, onChange=()=>{}}) => {

    const fnQuery = async (pageParam, queryKey) => await usePenawaranService.getList({pageParam, queryKey})


  return (
    <ComboBoxComponent
        label={'Penawaran/SPK'}
        keyName={'penawaran-list-kombox'}
        fnQuery={fnQuery}
        value={value}
        onChange={onChange}
        filter={(i) => ({...i, name: i.nama_project})}
    />
  )
}

export default PenawaranComboBox