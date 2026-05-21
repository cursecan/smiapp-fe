import ComboBoxComponent from './ComboBoxComponent'
import { useCustomerService } from '../../services/customer/customerService'
import { useQuery } from '@tanstack/react-query'

const CustomerComboBox = ({label, value, onChange=()=>{}, ...props}) => {
    const fnQuery = (pageParam, queryKey) => useCustomerService.list({pageParam, queryKey})

    const {data: selectedData, isLoading} = useQuery({
      queryKey: ['customer-detail-combox', value],
      queryFn: async () => {
        return await useCustomerService.detail(value)
      },
      select: (res) => {
        const data = res.data
        return {...data, name: `${data.full_name} (${data.email})`}
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
        filter={(i) => ({...i, name: `${i.full_name} (${i.email})`, description: i.company?.company_name || '-'})}
        onChange={onChange}
        value={selectedData}
        {...props}
    />
  )
}

export default CustomerComboBox