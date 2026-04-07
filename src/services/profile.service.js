import { api } from "../lib/api";



export const useProfileService = {
    getProfile: () => {
        return api.get('/user/profile/')
    }
}