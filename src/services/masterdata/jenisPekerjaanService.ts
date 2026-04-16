import { api } from "../../lib/api"


export const useJenisPekerjaanService = {
    list: () => {
        return api.get('/master/jenis-pekerjaan', {params: {limit: 20}})
    }
}