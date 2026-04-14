import { useAuth } from "../auth/AuthProvider"

export const useSchema = (schema) => {
    const status  = schema?.status[0] || null
    const userApprovals = status?.approval_by


    const { user } = useAuth()
    
    const canEdit = user?.id.includes(userApprovals) && status?.can_edit
    const canApprove = user?.id.includes(userApprovals) && status?.can_approve

  return {
    canEdit, canApprove
  }
}