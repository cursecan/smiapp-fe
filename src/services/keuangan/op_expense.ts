import {api} from '../../lib/api'


export const useExpOprasionalService = {
    list: () => {
        return api.get('keuangan/oprasional/')
    },
    detail: (id) => {
        return api.get(`keuangan/oprasional/${id}/`)
    }
}