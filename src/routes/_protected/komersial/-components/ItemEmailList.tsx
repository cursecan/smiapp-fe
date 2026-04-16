import { Avatar, Button, Chip, Disclosure, Dropdown, Label, Table } from '@heroui/react'
import { useFormatDate } from "../../../../utils/dateFormat"
import { ArrowRight, ArrowUpRight, Check, CheckDouble, CurlyBracketsLock, Eye, EyesLookLeft, Plus, SquarePlus } from '@gravity-ui/icons'
import ModalPenawaran from './penawaran/ModalPenawaran'

const ItemEmailList = ({item}) => {
  return (
    <Table.Row key={item.id}>
        {/* <Table.Cell className={'truncate'}>{useFormatDate(item.receive_date)}</Table.Cell> */}
        <Table.Cell>
            <Avatar color='danger'>
                <Avatar.Fallback>TJ</Avatar.Fallback>
            </Avatar>

        </Table.Cell>
        <Table.Cell>
            <div className="space-y-4">
                <div className="flex items-start gap-5">
                    <div className="text-orange-500">
                        {item.email_from}
                        <div className="text-gray-700 text-xs">{useFormatDate(item.receive_date)}</div>
                    </div>
                    {
                        !!item.penawaran && (
                            <>
                                <ArrowRight className='text-blue-400' />
                                <Chip color='success'>Sudah Dibuat Penawaran</Chip>
                            </>
                        )
                    }
                </div>
                <p className="">{item.subject}</p>

                <Disclosure>
                    <Disclosure.Heading>
                        <Button size='sm' slot={'trigger'} variant='secondary'>
                            <Eye />
                            View Content
                            <Disclosure.Indicator />
                        </Button>
                    </Disclosure.Heading>
                    <Disclosure.Content>
                        <Disclosure.Body className='space-y-6'>
                            <div className="">
                                { item.body }
                            </div>
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
                            <div className="flex justify-end items-center gap-3">
                                <ModalPenawaran disabled={!!item.penawaran} pesanan={item} />
                            </div>
                        </Disclosure.Body>
                    </Disclosure.Content>
                </Disclosure>
            </div>                                                  
        </Table.Cell>
        {/* <Table.Cell>
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
                            <Dropdown.Item variant='danger'>
                                <CurlyBracketsLock />
                                <Label>Block Email</Label>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown.Popover>
                </Dropdown>
            </div>
        </Table.Cell> */}
    </Table.Row>
  )
}

export default ItemEmailList