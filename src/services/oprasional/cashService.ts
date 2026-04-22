import {api} from "../../lib/api"



export const useCashService = {
    list: () => {
        return api.get('/operasional/cashbon/')
    },
    create: (payload) => {
        return api.post('/operasional/cashbon/', payload)
    },
    detail: (id) => {
        return api.get(`/operasional/cashbon/${id}/`)
    },
    edit: (id, payload) => {
        return api.put(`/operasional/cashbon/${id}/`, payload)
    },
    rincian: (id) => {
        return api.get(`/operasional/cashbon/${id}/rincian/`)
    },
    submit: (id) => {
        return api.post(`/operasional/cashbon/${id}/submit/`)
    }
}



export const useRincianCashService = {
    create: (payload) => {
        return api.post('/operasional/item-cash/', payload)
    },
    detail: (id) => {
        return api.get(`/operasional/item-cash/${id}/`)
    },
    edit: (id, payload) => {
        return api.put(`/operasional/item-cash/${id}/`, payload)
    },
    delete: (id) => {
        return api.post(`/operasional/item-cash/${id}/remove/`, id)
    },
}