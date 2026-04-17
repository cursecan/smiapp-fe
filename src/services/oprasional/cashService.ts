import {api} from "../../lib/api"



export const useCashService = {
    list: () => {
        return api.get('/operasional/cashbon/')
    },
    create: (payload) => {
        return api.post('/operasional/cashbon/')
    },
    detail: (id) => {
        return api.get(`/operasional/cashbon/${id}/`)
    },
    edit: (id, payload) => {
        return api.put(`/operasional/cashbon/${id}/`, payload)
    },
    rincian: (id) => {
        return api.get(`/operasional/cashbon/${id}/rincian`)
    }
}



export const useRincianCashService = {
    create: (payload) => {
        return api.post('/operasional/item-cash/')
    },
    detail: (id) => {
        return api.get(`/operasional/item-cash/${id}/`)
    },
    edit: (id, payload) => {
        return api.put(`/operasional/item-cash/${id}/`, payload)
    },
}