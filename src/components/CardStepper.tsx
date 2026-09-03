import { CheckDouble, Clock, Play, StarFill, Xmark } from '@gravity-ui/icons'
import { Card, Description, Label, Surface } from '@heroui/react'
import { formatDate } from '../utils/dateFormat'
const CardStepper = ({stepper=[], stepApprovals}) => {
    
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
                stepApprovals?.map((s, index) => {
                    return (
                        <>
                        {
                            s.active ? (
                                <Surface key={index} className='flex items-center gap-6 bg-success-soft py-2 rounded-xl'>
                                    <div className={`p-2 rounded-xl` }>
                                        <Play />
                                    </div>
                                    <div className='flex flex-col flex-1'>
                                        <Label>{s.name}</Label>
                                    </div>
                                </Surface>
                            ) : (
                                <Surface key={index} className='flex items-center gap-6'>
                                    <Surface className={`p-2 rounded-xl ${s.approved_at ? (s.is_approve ? 'bg-success text-white' : 'bg-danger-soft text-danger') : 'bg-default'}`}>
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
                        }
                        </>
                    )
                })
                }
            </div>
        </Card.Content>
    </Card>
  )
}

export default CardStepper