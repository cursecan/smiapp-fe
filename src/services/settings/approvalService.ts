import {api} from '../../lib/api'



export const useApprovalService = {
    list: () => {
        return api.get('/setting/approval-status/')
    }
}