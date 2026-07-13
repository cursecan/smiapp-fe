import { api } from '../../lib/api'


export const useBastService = {
    create: (payload) => {
        return api.post('oprasional/bast/', payload)
    },
    update: (id, payload) => {
        return api.put(`oprasional/bast/${id}/`, payload)
    },
    detail: (id) => {
        return api.get(`oprasional/bast/${id}/`)
    },
    items: (id) => {
        return api.get(`oprasional/bast/${id}/items/`)
    }
}


export const useItemBastService = {
    detail: (id) => {
        return api.get(`oprasional/item-bast/${id}/`)
    },
    update: (id, payload) => {
        return api.put(`oprasional/item-bast/${id}/`, payload)
    },
    drop: (id) => {
        return api.post(`oprasional/item-bast/${id}/drop/`)
    }
}