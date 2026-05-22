import { api } from '../../lib/api'


export const usePekerjaanService = {
    list: ({queryKey}) => {
        const [, pelabuhan, q] = queryKey
        return api.get('/master/pekerjaan/', {params: {pelabuhan, q}})
    }
}