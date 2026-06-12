import { api } from "../lib/api"

export const useEmailService = {
    getList: ({queryKey}) => {        
        const [, page, q, showALl] = queryKey 
        return api.get('/email/inbox/', {params: {page: page, q: q, all:showALl}})
    },
    toggle: (id) => {
        return api.post(`/email/inbox/${id}/toggle/`)
    }
}