import { Button, Checkbox, Description, Dropdown, Label, Table } from '@heroui/react'
import { formatDate } from "../../../../utils/dateFormat"
import { ArrowChevronRight, Envelope, Eye, EyeClosed } from '@gravity-ui/icons'
import ModalPenawaran from './penawaran/ModalPenawaran'
import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEmailService } from '../../../../services/email.service'

const ItemEmailList = ({item}) => {
    const [isHide, setIsHide] = useState(false)
    const [showContent, setShowContent] = useState(false)

    const navigate = useNavigate()
    

    const qc = useQueryClient()
    const mutation = useMutation({
        mutationFn: () => useEmailService.toggle(item.id),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['email-list']})
        }
    })

    const handleChange = () => {
        mutation.mutate()
    }

    useEffect(() => {
        if(item) {
            setIsHide(item.is_hide)
        }
    }, [item])


  return (
    <Table.Row key={item.id}>
        <Table.Cell>
            <div className="flex gap-3">
                <Envelope  />
                <div className="flex-1">
                    <Label>{item.subject}</Label>
                    <div className="">
                        <Description>
                            {
                                showContent ? <span>{item.body}</span> : (item.body.length > 250 ? item.body.slice(0, 250) + '...' : item.body)
                            }
                        </Description>
                        <div className="flex items-center gap-4 text-xs">
                            <button onClick={() => setShowContent((prev) => !prev)} className='text-red-900 flex items-center gap-1'>
                                {!showContent ? <EyeClosed /> : <Eye />}
                            </button>
                            <div className="">
                                <Checkbox isSelected={isHide} onChange={handleChange}>
                                    <Checkbox.Control>
                                        <Checkbox.Indicator />
                                    </Checkbox.Control>
                                    <Checkbox.Content>
                                        <Label>Hide</Label>
                                    </Checkbox.Content>
                                </Checkbox>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
        </Table.Cell>
        <Table.Cell>
            <div className="">
                <Label>{item.email_from}</Label> <br />
                <Description>{formatDate(item.receive_date)}</Description>
            </div>
        </Table.Cell>
        <Table.Cell>
            <div className="flex items-center gap-2 justify-end">
                {
                    (!!item.penawaran && item.penawaran.length) > 0 && (
                        <Dropdown>
                            <Button>Penawaran ({item.penawaran.length})</Button>
                            <Dropdown.Popover>
                                <Dropdown.Menu>
                                    {
                                        item.penawaran.map((i,index) => {
                                            return (
                                                <Dropdown.Item key={index} id={`penawaran_${index}`} isDisabled={i.is_revised} onPress={() => navigate({to: `/komersial/penawaran/${i.id}`})}>
                                                    <div className="flex justify-center">
                                                        <ArrowChevronRight />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <Label>{i.nomor}</Label>
                                                        <Description>{i.pelabuhan}</Description>
                                                    </div>
                                                </Dropdown.Item>
                                            )
                                        })
                                    }
                                </Dropdown.Menu>
                            </Dropdown.Popover>
                        </Dropdown>
                    ) 

                    // !!item.penawaran && <Button className={'text-danger'} isDisabled={item.penawaran.is_revised} onPress={() => navigate({to: `/komersial/penawaran/${item.penawaran.id}`})} variant='ghost'>
                    //     {
                    //         item.penawaran.is_revised ? <s>Lihat Penawaran</s> : <span>Lihat Penawaran</span>
                    //     }
                    // </Button>
                }
                <ModalPenawaran simple pesanan={item} />
                <ModalPenawaran simple revise pesanan={item} />

            </div>
        </Table.Cell>
        
    </Table.Row>
  )
}

export default ItemEmailList