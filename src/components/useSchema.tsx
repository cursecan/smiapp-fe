import { useAuth } from "../auth/AuthProvider"

export const useSchema = (schema) => {
    const status  = schema?.status[0] || null
    const userApprovals = status?.approval_by


    const { user } = useAuth()
    
    
    
    const userInApproval = userApprovals?.includes(user?.id)
    
    const canEdit = userInApproval && status?.can_edit && !status?.completed
    const canApprove = userInApproval && status?.can_approve && !status?.completed
    

  return {
    canEdit, canApprove
  }
}