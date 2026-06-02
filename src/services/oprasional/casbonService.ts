import { api } from '../../lib/api'


export const useCasbonService = {
    list: () => {
        return api.get('oprasional/casbon/')
    },
    create: (payload) => {
        return api.post('oprasional/casbon/', payload)
    },
    detail: (id) => {
        return api.get(`oprasional/casbon/${id}/`)
    },
    items: (id) => {
        return api.get(`oprasional/casbon/${id}/items/`)
    }
}