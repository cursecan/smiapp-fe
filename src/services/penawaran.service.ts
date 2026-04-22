import { api } from "../lib/api"

export const usePenawaranService = {
    getList: ({pageParam, queryKey}) => {
        const [_, q] = queryKey
        return api.get('/komersial/penawaran/', {params: {page: pageParam, q}})
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
    submit: (id) => {
        return api.post(`/komersial/penawaran/${id}/submit/`)
    },
    items: (id) => {
        return api.get(`/komersial/penawaran/${id}/items/`)
    },
    append_kapal: (id, payload) => {
        return api.post(`/komersial/penawaran/${id}/append-kapal/`, payload)
    },
    remove_kapal: (id, payload) => {
        return api.post(`/komersial/penawaran/${id}/remove-kapal/`, payload)
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
    progress: (id, payload) => {
        return api.post(`/komersial/item/${id}/progress/`, payload)
    },
}