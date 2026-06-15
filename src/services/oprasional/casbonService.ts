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
    update: (id, payload) => {
        return api.put(`oprasional/casbon/${id}/`, payload)
    },
    items: (id) => {
        return api.get(`oprasional/casbon/${id}/items/`)
    },
    submit: (id) => {
        return api.post(`oprasional/casbon/${id}/submit/`)
    },
    change_supply: (id, payload) => {
        return api.post(`oprasional/casbon/${id}/supply-change/`, payload)
    },

}