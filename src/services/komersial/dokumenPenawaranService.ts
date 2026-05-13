import {api} from '../../lib/api'



export const useDokumenPenawaranService = {
    update: (id, payload) => {
        return api.put(`/komersial/dokumen/${id}/`, payload)
    },
    // delete: (id) => {
    //     return api.delete(`/komersial/dokumen/${id}/`)
    // }
}