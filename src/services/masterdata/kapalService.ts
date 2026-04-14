import { api } from "../../lib/api"

export const useKapalService = {
    list: ({pageParam, queryKey}) => {
        const [_, q] = queryKey
        return api.get('/master/kapal/', {params: {page:pageParam, q}})
    }
}