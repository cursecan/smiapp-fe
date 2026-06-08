import { Button, Description, Dropdown, Label, Table, useOverlayState } from '@heroui/react'
import { formatDate } from "../../../../utils/dateFormat"
import { Envelope } from '@gravity-ui/icons'
import ModalPenawaran from './penawaran/ModalPenawaran'
import { useNavigate } from '@tanstack/react-router'

const ItemEmailList = ({item}) => {
    const navigate = useNavigate()

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
                                item.body.length > 250 ? item.body.slice(0, 250) + '...' : item.body
                            }
                        </Description>
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
                    !!item.penawaran && <Button className={'text-danger'} isDisabled={item.penawaran.is_revised} onPress={() => navigate({to: `/komersial/penawaran/${item.penawaran.id}`})} variant='ghost'>
                        {
                            item.penawaran.is_revised ? <s>Lihat Penawaran</s> : <span>Lihat Penawaran</span>
                        }
                    </Button>
                }
                <ModalPenawaran simple disabled={!!item.penawaran} pesanan={item} />
                 <ModalPenawaran simple revise pesanan={item} />

            </div>
        </Table.Cell>
        
    </Table.Row>
  )
}

export default ItemEmailList