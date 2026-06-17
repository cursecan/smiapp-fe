import {api} from '../../lib/api'


export const useExpOprasionalService = {
    list: ({queryKey}) => {
        const [, page, q] = queryKey
        return api.get('keuangan/oprasional/', {params: {page, q}})
    },
    detail: (id) => {
        return api.get(`keuangan/oprasional/${id}/`)
    }
}