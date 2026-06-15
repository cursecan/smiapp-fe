import {api} from '../../lib/api'


export const useExpenseService = {
    create: (payload) => {
        return api.post('keuangan/expense/', payload)
    }
}