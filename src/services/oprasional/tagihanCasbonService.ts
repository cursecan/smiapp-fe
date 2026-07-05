import {api} from '../../lib/api'


export const useTagihanCabonService = {
    create: (payload) => {
        return api.post('/oprasional/tagihan/', payload)
    },
    update: (id, payload) => {
        return api.put(`/oprasional/tagihan/${id}/`, payload)
    },
    detail: (id) => {
        return api.get(`/oprasional/tagihan/${id}/`)
    },
    drop: (id) => {
        return api.post(`/oprasional/tagihan/${id}/drop/`)
    }
}