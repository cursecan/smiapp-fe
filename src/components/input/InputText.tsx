import { Input, Label, TextField } from "@heroui/react"


const InputText = ({label, value, onChange=()=>{}, ...props}) => {
    return (
        <TextField>
            <Label>{label}</Label>
            <Input value={value} onChange={onChange} placeholder={props.placeholder} />
        </TextField>
      )
}

export default InputText