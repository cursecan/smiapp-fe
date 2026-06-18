import { api } from '../../lib/api'


export const useOprasionalService = {
    create: (payload) => {
        return api.post('/oprasional/opr/', payload)
    },
    list: ({pageParam, queryKey}) => {
        const [, page, q, all] = queryKey
        return api.get('/oprasional/opr/', {params: {page:pageParam, q, all}})
    },
    active_list: ({pageParam, queryKey}) => {
        console.log(queryKey, '0000000000000');
        
        const [, q] = queryKey
        return api.get('/oprasional/opr/active/', {params: {page: pageParam, q}})
    },
    detail: (id) => {
        return api.get(`/oprasional/opr/${id}/`)
    },
    progress: (id) => {
        return api.get(`/oprasional/opr/${id}/progress/`)
    },
    upload: (payload) => {
        return api.post('/oprasional/upload-progress/', payload)
    },
    casbon: (id) => {
        return api.get(`/oprasional/opr/${id}/casbon/`)
    }
}