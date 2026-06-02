import { api } from '../../lib/api'


export const useItemCasbonService = {
    create: (payload) => {
        return api.post('oprasional/item-casbon/', payload)
    },
    detail: (id) => {
        return api.get(`oprasional/item-casbon/${id}/`)
    },
    update: (id, payload) => {
        return api.put(`oprasional/item-casbon/${id}/`, payload)
    }
}