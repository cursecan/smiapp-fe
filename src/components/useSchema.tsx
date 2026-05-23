import { useAuth } from "../auth/AuthProvider"

export const useSchema = (schema) => {
    const approval  = schema?.approvals.at(-1)
    const userApprovals = approval?.approval_by


    const { user } = useAuth()
    
    
    const userInApproval = userApprovals?.includes(user?.id)
    
    const canEdit = userInApproval && approval?.can_edit && !approval?.completed
    const canApprove = userInApproval && approval?.can_approve && !approval?.completed

    const hasAuth = userInApproval
    

  return {
    canEdit, canApprove, hasAuth
  }
}