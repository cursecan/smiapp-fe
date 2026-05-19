import { api } from '../../lib/api'


export const useOprasionalService = {
    create: (payload) => {
        return api.post('/oprasional/opr/', payload)
    },
    list: ({pageParam, queryKkey}) => {
        console.log(pageParam, queryKkey);
        
        return api.get('/oprasional/opr/')
    },
    detail: (id) => {
        return api.get(`/oprasional/opr/${id}/`)
    },
    catatan: (id) => {
        return api.get(`/oprasional/opr/${id}/catatan/`)
    },
}