import { Button, Chip, Dropdown, Label, Table } from '@heroui/react'
import { useFormatDate } from "../../../../utils/dateFormat"
import { ArrowUpRight, Check, CheckDouble, CurlyBracketsLock, EyesLookLeft, SquarePlus } from '@gravity-ui/icons'
import ModalPenawaran from './penawaran/ModalPenawaran'

const ItemEmailList = ({item}) => {
  return (
    <Table.Row key={item.id}>
        <Table.Cell className={'truncate text-orange-500'}>{useFormatDate(item.receive_date)}</Table.Cell>
        <Table.Cell>{item.email_from}</Table.Cell>
        <Table.Cell>
            <div className="">
                <p className='mb-2'>{item.subject}</p>
                <div className="">
                    {
                        item.attachments.length>0 && (
                            <div className="flex flex-wrap gap-1">
                                {
                                    item.attachments.map((f, index) => {
                                        return (
                                            <Chip key={index}>
                                                <a target='_blank' href={f.filepath} key={index}>{f.filename}</a>
                                            </Chip>
                                        )
                                    })
                                }
                            </div>
                        )
                    }
                </div>
            </div>                                                  
        </Table.Cell>
        <Table.Cell>
            {
                item.penawaran && (
                    <Button isIconOnly variant='tertiary'>
                        <CheckDouble className='text-orange-500' />
                    </Button>
                )
            }
        </Table.Cell>
        <Table.Cell>
            <div className="flex flex-col gap-2">
                <ModalPenawaran disabled={!!item.penawaran} pesanan={item} />
                <Dropdown>
                    <Button size='sm' variant='secondary'>
                        Action
                    </Button>
                    <Dropdown.Popover>
                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <EyesLookLeft />
                                <Label>View Content</Label>
                            </Dropdown.Item>
                            {/* <Dropdown.Item>
                                <SquarePlus />
                                <Label>Buat Penawaran</Label>
                            </Dropdown.Item> */}
                            <Dropdown.Item variant='danger'>
                                <CurlyBracketsLock />
                                <Label>Block Email</Label>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Popover>
                </Dropdown>
            </div>
        </Table.Cell>
    </Table.Row>
  )
}

export default ItemEmailList