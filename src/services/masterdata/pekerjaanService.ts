import { api } from '../../lib/api'


export const usePekerjaanService = {
    list: ({queryKey}) => {
        const [, q, pelabuhan] = queryKey
        return api.get('/master/pekerjaan/', {params: {pelabuhan, q}})
    },
    detail: (id) => {
        return api.get(`/master/pekerjaan/${id}/`)
    }
}