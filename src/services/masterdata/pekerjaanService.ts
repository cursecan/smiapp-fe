import { api } from '../../lib/api'


export const usePekerjaanService = {
    list: ({queryKey}) => {
        const [, q, pelabuhan, j_pekerjaan] = queryKey
        return api.get('/master/pekerjaan/', {params: {pelabuhan, q, j_pekerjaan}})
    },
    detail: (id) => {
        return api.get(`/master/pekerjaan/${id}/`)
    }
}