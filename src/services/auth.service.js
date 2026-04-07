import { api } from "../lib/api"

export const useAuthService = {
    logout: () => {
        return api.post('/auth/logout/')
    }
}