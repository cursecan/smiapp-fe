import { api } from "../../lib/api"

export const useCustomerService = {
    list: ({pageParam, queryKey}) => {
        const [, q] = queryKey
        return api.get('/customer/customer/', {params: {page: pageParam, q}})
    },
    create: (payload) => {
        return api.post('/customer/customer/', payload)
    },
    detail: (id) => {
        return api.get(`/customer/customer/${id}/`)
    }
}