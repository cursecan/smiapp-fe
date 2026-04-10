import { api } from "../../lib/api"

export const useKapalService = {
    list: ({limit=10, page=0, q=''}) => {
        const offset = limit * page
        return api.get('/master/kapal/', {params: {limit, offset, q}})
    }
}