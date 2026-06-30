import {api} from '../../lib/api'


export const useDashboardService = {
    resume_penawaran: ({queryKey}) => {
        const [, period] = queryKey
        return api.get('dashboard/resume-penawaran/', {params: {period}})
    }
}