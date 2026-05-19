import { Description, Label, Surface, Table } from '@heroui/react'
import { formatDate } from "../../../../utils/dateFormat"
import { CheckDouble,  DiamondExclamation } from '@gravity-ui/icons'
import ModalPenawaran from './penawaran/ModalPenawaran'

const ItemEmailList = ({item}) => {
  return (
    <Table.Row key={item.id}>
        <Table.Cell>
            <div className="flex items-center gap-2">
                <Surface className={`rounded-full p-2 ${item.penawaran ? 'bg-success' : 'bg-warning'}`}>
                    { item.penawaran ? <CheckDouble /> : <DiamondExclamation />}
                </Surface>
                <div className="flex-1 gap-2 flex flex-col">
                    <div className="flex items-center">
                        <div className="flex gap-6">
                            <Description>{formatDate(item.receive_date)}</Description>
                            <Description>{item.email_from}</Description>
                        </div>
                    </div>
                    <Label className="">{item.subject}</Label>
                </div>                                                  
            </div>
        </Table.Cell>
        <Table.Cell>
            {
                !item.penawaran && (
                    <ModalPenawaran disabled={!!item.penawaran} pesanan={item} />
                )
            }
        </Table.Cell>
        
    </Table.Row>
  )
}

export default ItemEmailList