import ComboBoxComponent from './ComboBoxComponent'
import { useCustomerService } from '../../services/customer/customerService'

const CustomerComboBox = ({label, value, onChange=()=>{}}) => {
    const fnQuery = (pageParam, queryKey) => useCustomerService.list({pageParam, queryKey})

  return (
    <ComboBoxComponent
        label={label}
        fnQuery={fnQuery}
        keyName={'customer-list-combox'}
        filter={(i) => ({...i, name: i.full_name, description: i.company?.company_name || '-'})}
        onChange={onChange}
        value={value}
    />
  )
}

export default CustomerComboBox