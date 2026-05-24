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


export const getApprovalStatus = (modul) => {
  const data = JSON.parse(localStorage.getItem('approval')).map(i => ({...i, name_id: i.name.replace(/\s+/g, "_").toLowerCase()}))

  return data.filter(i=> i.approval.modul_name===modul)
}