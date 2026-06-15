import {api} from '../../lib/api'


export const useSatuanService = {
    list: () => {
        return api.get('master/satuan/')
    },
    detail: (id) => {
        return api.get(`master/satuan/${id}/`)
    },
    update: (id, payload) => {
        return api.put(`master/satuan/${id}/`, payload)
    }
}