import { api } from '../../lib/api'


export const useOprasionalService = {
    create: (payload) => {
        return api.post('/oprasional/opr/', payload)
    },
    list: ({queryKey}) => {
        const [, page, q] = queryKey
        return api.get('/oprasional/opr/', {params: {page, q}})
    },
    detail: (id) => {
        return api.get(`/oprasional/opr/${id}/`)
    },
    progress: (id) => {
        return api.get(`/oprasional/opr/${id}/progress/`)
    },
    upload: (payload) => {
        return api.post('/oprasional/upload-progress/', payload)
    }
}