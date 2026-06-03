import { Button, Dropdown, Label } from "@heroui/react"
import { useState } from "react"

const PeriodeFilter = () => {
    const [selected, setSelected] = useState(new Set(['current-month']))

    const trans_selection = () => {
        const value = Array.from(selected)[0]
        return value.replace('-', ' ')
    }
    

    return (
    <div className="">

        <Dropdown>
            <Dropdown.Trigger>
                <Button variant="outline" className={'capitalize'}>{trans_selection()}</Button>
            </Dropdown.Trigger>
            <Dropdown.Popover>
                <Dropdown.Menu 
                    selectedKeys={selected}
                    selectionMode="single"
                    onSelectionChange={setSelected}
                >
                    <Dropdown.Item id="current-month" textValue="Current Month">
                        <Dropdown.ItemIndicator />
                        <Label>Current Month</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="last-month" textValue="Last Month">
                        <Dropdown.ItemIndicator />
                        <Label>Last Month</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="3-last-month" textValue="Last 3 Months Ago">
                        <Dropdown.ItemIndicator />
                        <Label>Last 3 Months Ago</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="6-last-month" textValue="Last 6 Months Ago">
                        <Dropdown.ItemIndicator />
                        <Label>Last 6 Months Ago</Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="last-year" textValue="Last Year">
                        <Dropdown.ItemIndicator />
                        <Label>Last Year</Label>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    </div>
  )
}

export default PeriodeFilter