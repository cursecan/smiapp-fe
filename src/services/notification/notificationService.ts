import {api} from '../../lib/api'


export const useNotificationService = {
    list: () => {
        return api.get('/notification/get-notification/')
    }
}