import { Label, ComboBox, Input, ListBox } from '@heroui/react'
import React from 'react'

const ComboBoxComponent = () => {
  return (
    <ComboBox>
        <Label>Label</Label>
        <ComboBox.InputGroup>
            <Input placeholder='Search...' />
            <ComboBox.Trigger />
        </ComboBox.InputGroup>
        <ComboBox.Popover>
            <ListBox>
                <ListBox.Item id={'cat'} textValue='Cat'>
                    Cat
                    <ListBox.ItemIndicator />
                </ListBox.Item>
            </ListBox>
        </ComboBox.Popover>
    </ComboBox>
  )
}

export default ComboBoxComponent