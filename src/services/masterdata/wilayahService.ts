import { api } from '../../lib/api'


export const useWilayahService = {
    list: ({pageParam, queryKey}) => {
        console.log(queryKey);
        
        const [_, q] = queryKey
        return api.get('/master/lokasi/', {params: {page: pageParam, q}})
    }
}