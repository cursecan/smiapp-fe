import { api } from "../lib/api"

export const useEmailService = {
    getList: ({page=0, limit=10, q=''}) => {
        const offset = page * limit
        return api.get('/email/inbox/', {params: {offset, limit, q}})
    }
}