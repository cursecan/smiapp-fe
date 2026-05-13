import { api } from "../../lib/api.js"


export const useUploadDokumenService = {
    upload: (payload) => {
        return api.post('/upload-dokumen/', payload)
    }
}