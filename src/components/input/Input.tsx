import { Label, TextField, Input } from '@heroui/react'

const Input = ({label, value, onChange=()=>{}, ...props}) => {
  return (
    <TextField>
        <Label>{label}</Label>
        <Input value={value} onChange={onChange} placeholder={props.placeholder} />
    </TextField>
  )
}

export default Input