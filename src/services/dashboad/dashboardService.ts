import {api} from '../../lib/api'


export const useDashboardService = {
    resume_penawaran: ({queryKey}) => {
        const [, filter] = queryKey
        return api.get('dashboard/resume-penawaran/', {params: {filter}})
    }
}