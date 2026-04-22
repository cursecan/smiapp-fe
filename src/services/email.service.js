import { api } from "../lib/api"

export const useEmailService = {
    getList: ({queryKey}) => {
        console.log(queryKey);
        
        const [_, page, q] = queryKey 
        return api.get('/email/inbox/', {params: {page: page, q: q}})
    }
}