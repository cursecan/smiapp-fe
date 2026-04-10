import { api } from "../lib/api"

export const usePenawaranService = {
    getList: ({page=0, limit=10, q=''}) => {
        const offset = page * limit
        return api.get('/komersial/penawaran/', {params: {offset, limit, q}})
    },
    detail: (id) => {
        return api.get(`/komersial/penawaran/${id}/`)
    },
    create: (payload) => {
        return api.post('/komersial/penawaran/', payload)
    },
    edit: (id, payload) => {
        return api.put(`/komersial/penawaran/${id}/`, payload)
    },

    items: (id) => {
        return api.get(`/komersial/penawaran/${id}/items/`)
    }
}



export const useItemPenawaranService = {
    create: (payload) => {
        return api.post('/komersial/item/', payload)
    },
    detail: (id) => {
        return api.get(`/komersial/item/${id}/`)
    },
    edit: (id, payload) => {
        return api.put(`/komersial/item/${id}/`, payload)
    },
    delete: (id) => {
        return api.post(`/komersial/item/${id}/delete/`)
    },
}