import { Input, Label, TextField } from "@heroui/react"
import { useEffect, useState } from "react"


const CurrencyInput = ({
    value,
    label,
    onChange=()=>{},
    ...props
}) => {
    
    const [numValue, setNumValue] = useState(0)

    const formatRupiah = (val) => {
        const number = String(val||0).replace(/[^\d.]/g, '')
        const nm = new Intl.NumberFormat('en-EN').format(number)
        return nm
    }
    
    const handleChange = (e) => {
        const raw = String(e.target.value)
        const converNUmber = Number(raw.replace(/[^\d.]/g, '') ||0)
        onChange(converNUmber)
        
        
        setNumValue(formatRupiah(raw))
    }

    useEffect(() => {
        if (value) {
            setNumValue(formatRupiah(value))
        }
    }, [value])
    


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