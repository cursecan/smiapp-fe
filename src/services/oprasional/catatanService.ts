import {api} from '../../lib/api'


export const useCatatanOpsService = {
    create: (payload) => {
        return api.post('/oprasional/catatan/', payload)
    },
    detail: (id) => {
        return api.get(`/oprasional/catatan/${id}/`)
    }
}