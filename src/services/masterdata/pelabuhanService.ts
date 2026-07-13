import {api} from '../../lib/api'


export const usePelabuhanService = {
    list: ({pageParam, queryKey}) => {
        const [, q] = queryKey
        return api.get('/master/pelabuhan/', {params: {page: pageParam, q}})
    },
    detail: (id) => {
        return api.get(`/master/pelabuhan/${id}/`)
    }
}