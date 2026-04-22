import { api } from '../../lib/api'


export const useOprasionalService = {
    list: ({pageParam, queryKkey}) => {
        return api.get('/oprasional/opr/')
    },
    detail: (id) => {
        return api.get(`/oprasional/opr/${id}/`)
    },
    catatan: (id) => {
        return api.get(`/oprasional/opr/${id}/catatan/`)
    },
}