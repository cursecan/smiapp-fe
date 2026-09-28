import { CheckDouble, Clock, Play, Xmark } from '@gravity-ui/icons'
import { Card, Description, Label, Surface } from '@heroui/react'
import { formatDate } from '../utils/dateFormat'

const CardStepper = ({ stepper = [], stepApprovals }) => {
  const clean_stepper = stepper.map((i, index) => {
    let name = i.name
    if (index > 0 && i.is_approve) {
      if (!stepper.at(index - 1).is_approve) {
        name = 'Revisi'
      }
    }
    return { ...i, name }
  })

  return (
    <Card>
      <Card.Header>
        <Card.Title>Progress Status</Card.Title>
        <Card.Description>Lorem ipsum dolor sit amet.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="flex flex-col gap-6">
          {stepApprovals?.map((s, index) => {
            // Gunakan ID dari data jika ada (misal: s.id), atau fallback ke index
            const itemKey = s.id || index

            if (s.active) {
              return (
                <Surface
                  key={itemKey}
                  className="flex items-center gap-6 rounded-xl bg-success-soft py-2"
                >
                  <div className="rounded-xl p-2">
                    <Play />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Label>{s.name}</Label>
                  </div>
                </Surface>
              )
            }

            return (
              <Surface key={itemKey} className="flex items-center gap-6">
                <Surface
                  className={`rounded-xl p-2 ${
                    s.approved_at
                      ? s.is_approve
                        ? 'bg-success text-white'
                        : 'bg-danger-soft text-danger'
                      : 'bg-default'
                  }`}
                >
                  {s.approved_at ? (
                    s.is_approve ? (
                      <CheckDouble />
                    ) : (
                      <Xmark />
                    )
                  ) : (
                    <Clock />
                  )}
                </Surface>
                <Surface className="flex flex-1 flex-col">
                  <Label>{s.name}</Label>
                  {s.approved_at && (
                    <>
                      {s.is_approve ? (
                        <>
                          <Description>
                            {s.step > 1 ? 'Approved' : 'Created'} by{' '}
                            {s.approval_by?.full_name}
                          </Description>
                          <Description>
                            {formatDate(s.approved_at)}
                          </Description>
                        </>
                      ) : (
                        <Description>{s.message}</Description>
                      )}
                    </>
                  )}
                </Surface>
              </Surface>
            )
          })}
        </div>
      </Card.Content>
    </Card>
  )
}

export default CardStepper