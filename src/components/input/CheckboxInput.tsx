import { Checkbox } from "@heroui/react"

const CheckboxInput = ({label, value=false, onChange=()=>{}, ...props}) => {
  return (
    <Checkbox isSelected={value} onChange={onChange} {...props}>
        <Checkbox.Content>
          <Checkbox.Control>
              <Checkbox.Indicator />
          </Checkbox.Control>
          {label}
        </Checkbox.Content>
    </Checkbox>
  )
}

export default CheckboxInput