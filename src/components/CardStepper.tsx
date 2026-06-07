import { CheckDouble, Clock, Xmark } from '@gravity-ui/icons'
import { Card, Description, Label, Surface } from '@heroui/react'
import { formatDate } from '../utils/dateFormat'
const CardStepper = ({stepper=[]}) => {
    const clean_stepper = stepper.map((i, index) => {
        let name = i.name
        if (index > 0 && i.is_approve) {
            if (!stepper.at(index-1).is_approve) {
                name = 'Revisi'
            }
        }

        return {...i, name: name}
    })

  return (
    <Card>
        <Card.Header>
            <Card.Title>Progress Status</Card.Title>
            <Card.Description>
                Lorem ipsum dolor sit amet.
            </Card.Description>
        </Card.Header>
        <Card.Content>
            <div className="flex flex-col gap-6">
                {
                clean_stepper.map((s, index) => {
                    return (
                    <Surface key={index} className='flex items-center gap-6'>
                        <Surface className={`p-2 rounded-xl ${s.approved_at ? (s.is_approve ? 'bg-success' : 'bg-danger-soft text-danger') : 'bg-amber-100'}`}>
                        {
                            s.approved_at ? (s.is_approve ? <CheckDouble /> : <Xmark />) : <Clock />
                        }
                        </Surface>
                        <Surface className='flex flex-col flex-1'>
                        <Label>{s.name}</Label>
                        {
                            s.approved_at && (
                            <>
                                {
                                    s.is_approve ? (
                                        <>
                                            <Description>{s.step > 1 ? 'Approved' : 'Created'} by {s.approval_by?.full_name}</Description>
                                            <Description>{formatDate(s.approved_at)}</Description>
                                        </>
                                    ) : (
                                        <Description>{s.message}</Description>
                                    )
                                }
                            </>
                            )
                        }
                        </Surface>
                    </Surface>

                    )
                })
                }
            </div>
        </Card.Content>
    </Card>
  )
}

export default CardStepper