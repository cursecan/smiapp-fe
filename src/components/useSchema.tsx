import { id } from "zod/v4/locales"
import { useAuth } from "../auth/AuthProvider"

export const useSchema = (schema) => {
    const approval  = schema?.approvals.at(0)
    const userApprovals = approval?.approval_by


    const { user } = useAuth()
    
    
    const userInApproval = userApprovals?.includes(user?.id)
    
    const canEdit = userInApproval && approval?.can_edit && !approval?.completed
    const canApprove = userInApproval && approval?.can_approve && !approval?.completed

    const hasAuth = userInApproval

    const canRevise = approval?.can_revise_by && approval?.can_revise_by === user?.id

    const stepper = schema?.stepper || []

    const record = stepper.filter(i => i.approved_at).map((i, index) => {
        let name = i.name
        if (index > 0 && i.is_approve) {
            if (!schema?.stepper.at(index-1).is_approve) {
                name = 'Revisi'
            }
        }

        return {...i, name: name}
    })

    const idleStep = stepper.filter(i => !i.approved_at).map(i => {
      if (i.step === schema?.approvals?.at(0)?.step) {
    
        return {...i, active: true}
      }

      return {...i}
    })


    const stepApprovals = [
      ...record, ...idleStep
    ]

    const currentStep = schema?.approvals?.at(0)
    

  return {
    canEdit, canApprove, hasAuth, canRevise, stepApprovals, currentStep
  }
}


export const getApprovalStatus = (modul) => {
  const data = JSON.parse(localStorage.getItem('approval')).map(i => ({...i, name_id: i.name.replace(/\s+/g, "_").toLowerCase()}))

  return data.filter(i=> i.approval.modul_name===modul)
}


export const getJenisPekerjaan = () => {
  const data = JSON.parse(localStorage.getItem('j_pekerjaan')).map(i => ({...i, name_id: i.id, name: i.jenis_pekerjaan}))
  return data
}