import { api } from '../../lib/api'


export const useInvoiceService = {
    list: () => {
        return api.get('/invoice/invoice/')
    },
    create: (payload) => {
        return api.post('/invoice/invoice/', payload)
    }, 
    detail: (id) => {
        return api.get(`/invoice/invoice/${id}/`)
    },
    update: (id, payload) => {
        return api.get(`/invoice/invoice/${id}/`, payload)
    }
}