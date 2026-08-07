import { api } from '../../lib/api'


export const useProgressService = {
    drop: (id) => {
        return api.post(`/oprasional/progress/${id}/drop/`)
    }
}