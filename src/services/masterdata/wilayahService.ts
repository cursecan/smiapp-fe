import { api } from '../../lib/api'


export const useWilayahService = {
    list: ({pageParam, queryKey}) => {
        
        const [, q] = queryKey
        return api.get('/master/lokasi/', {params: {page: pageParam, q}})
    }
}