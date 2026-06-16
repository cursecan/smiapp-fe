import { Checkbox, Label } from "@heroui/react"

const CheckboxInput = ({label, value=false, onChange=()=>{}, ...props}) => {
  return (
    <Checkbox isSelected={value} onChange={onChange} {...props}>
        <Checkbox.Control>
            <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Content>
            <Label>{label}</Label>
        </Checkbox.Content>
    </Checkbox>
  )
}

export default CheckboxInput