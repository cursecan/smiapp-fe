import { api } from '../../lib/api'


export const usePegawayService = {
    list: () => {
        return api.get('/master/pegawai/')
    },
    detai: (id) => {
        return api.get(`/master/pegawai/${id}/`)
    },
    agens: () => {
        return api.get('/master/pegawai/agens/')
    }
}