import { CheckDouble, Clock } from '@gravity-ui/icons'
import { Card, Description, Label, Surface } from '@heroui/react'
import { formatDate } from '../utils/dateFormat'
const CardStepper = ({stepper=[]}) => {
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
                stepper.map((s, index) => {
                    return (
                    <Surface key={index} className='flex items-center gap-6'>
                        <Surface className={`p-2 rounded-xl ${s.approved_at ? 'bg-success' : 'bg-amber-100'}`}>
                        {
                            s.approved_at ? <CheckDouble /> : <Clock />
                        }
                        </Surface>
                        <Surface className='flex flex-col flex-1'>
                        <Label>{s.name}</Label>
                        {
                            s.approved_at && (
                            <>
                                <Description>{s.step > 1 ? 'Approved' : 'Created'} by {s.approval_by?.full_name}</Description>
                                <Description>{formatDate(s.approved_at)}</Description>
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