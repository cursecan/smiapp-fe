import { api } from '../../lib/api'


export const useOprasionalService = {
    create: (payload) => {
        return api.post('/oprasional/opr/', payload)
    },
    list: ({queryKey}) => {
        const [, page, q, pic] = queryKey
        return api.get('/oprasional/opr/', {params: {page, q, pic}})
    },
    active_list: ({pageParam, queryKey}) => {
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
    },
    barequest: (id, payload) => {
        return api.post(`/oprasional/opr/${id}/barequest/`, payload)
    }
}