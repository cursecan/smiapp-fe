import { api } from "../../lib/api"


export const useJenisPekerjaanService = {
    list: () => {
        return api.get('/master/jenis-pekerjaan')
    },
    detail: (id) => {
        return api.get(`/master/jenis-pekerjaan/${id}/`)
    }
}