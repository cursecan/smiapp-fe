import { api } from "../lib/api"

export const useEmailService = {
    getList: ({queryKey}) => {        
        const [, page, q] = queryKey 
        return api.get('/email/inbox/', {params: {page: page, q: q}})
    }
}