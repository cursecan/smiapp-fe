import {api} from '../../lib/api'


export const useSerahTerimaService  = {
    create: (payload) => {
        return api.post('oprasional/ba-terima/', payload)
    }
}