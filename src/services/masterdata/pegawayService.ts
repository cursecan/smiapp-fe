import { api } from '../../lib/api'


export const usePegawayService = {
    list: () => {
        return api.get('/master/pegawai/')
    }
}