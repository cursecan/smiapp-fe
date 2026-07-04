import {api} from '../../lib/api'


export const useDashboardService = {
    resume_penawaran: () => {
        return api.get('dashboard/resume-penawaran/')
    },
    resume_oprs: () => {
        return api.get('dashboard/resume-oprs/')
    },
    resume_agens: () => {
        return api.get('dashboard/resume-agens/')
    }
}