import { api } from "../../lib/api"


export const useJenisPekerjaanService = {
    list: ({pageParam, queryKey}) => {
        const [_, q] = queryKey
        return api.get('/master/jenis-pekerjaan', {params: {page: pageParam, q}})
    },
    detail: (id) => {
        return api.get(`/master/jenis-pekerjaan/${id}/`)
    }
}