import { Description, Label, ListBox, Select } from '@heroui/react'
import { useEffect, useState } from 'react'

const SelectComponent = ({
    label,
    value,
    data=[],
    multiple=false,
    onChange=()=>{},
    ...props
}) => {
    const a = () => {
        if (multiple) {
            return value?.map(i => i.id)
        }
        return value
    }
    const [selectedValue, setSelectedValue] = useState(null)

    const changeValue = (e) => {
        setSelectedValue(e)
        onChange(e)
    }

    useEffect(() => {
        setSelectedValue(a)
    }, [value])


  return (
    <Select value={selectedValue} onChange={changeValue} selectionMode={!multiple ? 'single' : 'multiple'} {...props}>
        {
            label && (
                <Label>{label}</Label>
            )
        }
        <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
            <ListBox>
                {
                    data?.map(i => {
                        return (
                            <ListBox.Item key={i.id} id={i.id} textValue={i.label}>
                                {
                                    i?.title ? (
                                        <div className="flex flex-col">
                                            <Label>{i.title}</Label>
                                            <Description>{i.description}</Description>
                                        </div>
                                    ) : (
                                        <>
                                            { i.label }
                                            <ListBox.ItemIndicator />
                                        </>
                                    )
                                }
                            </ListBox.Item>
                        )
                    })
                }
            </ListBox>
        </Select.Popover>
    </Select>    
  )
}

export default SelectComponent