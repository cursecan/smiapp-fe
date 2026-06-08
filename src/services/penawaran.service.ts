import { api } from "../lib/api"

export const usePenawaranService = {
    getList: ({queryKey}) => {
        const [, page, q, filter, pekerjaan] = queryKey
        return api.get('/komersial/penawaran/', {params: {page, q, filter, pekerjaan}})
    },
    detail: (id) => {
        return api.get(`/komersial/penawaran/${id}/`)
    },
    create: (payload) => {
        return api.post('/komersial/penawaran/', payload)
    },
    revise: (payload) => {
        return api.post('/komersial/penawaran/revise/', payload)
    },
    edit: (id, payload) => {
        return api.put(`/komersial/penawaran/${id}/`, payload)
    },
    submit: (id, payload) => {
        return api.post(`/komersial/penawaran/${id}/submit/`, payload)
    },
    items: (id) => {
        return api.get(`/komersial/penawaran/${id}/items/`)
    },
    append_kapal: (id, payload) => {
        return api.post(`/komersial/penawaran/${id}/append-kapal/`, payload)
    },
    remove_kapal: (id, payload) => {
        return api.post(`/komersial/penawaran/${id}/remove-kapal/`, payload)
    },
    documents: (id) => {
        return api.get(`/komersial/penawaran/${id}/documents/`)
    },
    reply_email: (id, payload) => {
        return api.post(`/komersial/penawaran/${id}/reply-email/`, payload)
    },
    update_customer: (id, payload) => {
        return api.put(`/komersial/penawaran/${id}/update_customer/`, payload)
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