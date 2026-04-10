import { api } from '../../lib/api'


export const usePekerjaanService = {
    list: () => {
        return api.get('/master/pekerjaan/')
    }
}