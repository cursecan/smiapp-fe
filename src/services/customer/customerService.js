import { api } from "../../lib/api"

export const useCustomerService = {
    list: ({limit=10, page=0, q=''}) => {
        const offset = limit * page
        return api.get('/customer/customer/', {params: {limit, offset, q}})
    },
    create: (payload) => {
        return api.post('/customer/customer/', payload)
    }
}