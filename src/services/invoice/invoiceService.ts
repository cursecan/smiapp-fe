import { api } from '../../lib/api'


export const useInvoiceService = {
    list: ({queryKey}) => {
        const [, page, q, status] = queryKey
        return api.get('/invoice/invoice/', {params: {page, q, status}})
    },
    create: (payload) => {
        return api.post('/invoice/invoice/', payload)
    }, 
    detail: (id) => {
        return api.get(`/invoice/invoice/${id}/`)
    },
    update: (id, payload) => {
        return api.get(`/invoice/invoice/${id}/`, payload)
    },
    submit: (id, payload) => {
        return api.post(`/invoice/invoice/${id}/submit/`, payload)
    },
}