import { api } from "../../lib/api"

export const useCustomerService = {
    list: ({pageParam, queryKey}) => {
        const {_, q} = queryKey
        return api.get('/customer/customer/', {params: {page: pageParam, q}})
    },
    create: (payload) => {
        return api.post('/customer/customer/', payload)
    }
}