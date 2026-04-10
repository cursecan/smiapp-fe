import { useQuery } from '@tanstack/react-query'
import { useCustomerService }  from "../../services/customer/customerService"
import SelectComponent from './SelectComponent';

const CustomerSelect = ({label, value, disable=false, onChange=()=>{}}) => {
    const {data} = useQuery({
        queryKey: ['customer-list-select'],
        queryFn: async () => useCustomerService.list({limit: 200, page: 0, q: ''}),
        select: (data) => data.data.results.map(i => ({...i, label: i.full_name, title: `${i.full_name} - ${i.company?.company_name}`, description: i.email || 'No email'}))
    })
    

  return (
    <SelectComponent disable={disable} value={value} onChange={onChange} label={label || 'Customer'} data={data} />
  )
}

export default CustomerSelect