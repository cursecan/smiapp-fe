import { FieldError, Input, Label, TextField } from "@heroui/react"


const InputText = ({label, value, onChange=()=>{}, error, ...props}) => {
    return (
        <TextField isInvalid={!!error} isDisabled={props.isDisabled}>
            <Label>{label}</Label>
            <Input value={value} onChange={onChange} placeholder={props.placeholder} />
            {
                !!error && (
                    <FieldError>{error.message}</FieldError>
                )
            }
        </TextField>
      )
}

export default InputText