import { Input, Label, TextField } from "@heroui/react"
import { useState } from "react"


const CurrencyInput = ({
    value,
    label,
    onChange=()=>{},
    ...props
}) => {

    const formatRupiah = (val) => {
        const number = String(val||0).replace(/[^\d.]/g, '')
        return new Intl.NumberFormat('en-EN').format(number)
    }
    
    const handleChange = (e) => {
        const raw = String(e.target.value)
        // console.log(raw);
        const converNUmber = Number(raw.replace(/[^\d.]/g, '') ||0)
        onChange(converNUmber)
        
        
        setNumValue(formatRupiah(raw))
    }
    
    const [numValue, setNumValue] = useState(formatRupiah(value))


  return (
    <TextField>
        {
            label && (
                <Label>{label}</Label>
            )
        }
        <Input value={numValue} onChange={handleChange} {...props} />
    </TextField>
  )
}

export default CurrencyInput