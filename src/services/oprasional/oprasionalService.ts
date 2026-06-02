import { api } from '../../lib/api'


export const useOprasionalService = {
    create: (payload) => {
        return api.post('/oprasional/opr/', payload)
    },
    list: ({queryKey}) => {
        const [, page, q] = queryKey
        return api.get('/oprasional/opr/', {params: {page, q}})
    },
    active_list: ({queryKey}) => {
        const [, page, q] = queryKey
        return api.get('/oprasional/opr/active/', {params: {page, q}})
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