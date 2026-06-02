import { FieldError, Input, Label, TextField } from "@heroui/react"


const InputText = ({label, value, onChange=()=>{}, error, ...props}) => {
    return (
        <TextField isInvalid={!!error} isDisabled={props.isDisabled}>
            <Label>{label}</Label>
            <Input autoComplete="Anderi" value={value} onChange={onChange} placeholder={props.placeholder} type={props.type || 'text'} />
            {
                !!error && (
                    <FieldError>{error.message}</FieldError>
                )
            }
        </TextField>
      )
}

export default InputText