import { ListBox, Select } from "@heroui/react"
import { useState } from "react"

const StatusApprovalFilter = ({data, value, onChange}) => {
    const [state, setState] = useState(value)

    const changeValue = (e) => {
        onChange(e)
        setState(e)
    }


  return (
    <Select
        value={state}
        onChange={changeValue}
        defaultValue={''}
        placeholder="Status"
        className={'w-56'}
    >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
            <ListBox>
                <ListBox.Item key={'all'} id='' textValue={''}>
                    Semua Status
                </ListBox.Item>
                {
                    data.map(i => {
                        return (
                            <ListBox.Item key={i.id} id={i.name_id} textValue={i.name}>
                                { i.name }
                            </ListBox.Item>

                        )
                    })
                }
            </ListBox>
        </Select.Popover>
    </Select>
  )
}

export default StatusApprovalFilter