import { Input } from "@heroui/react"
import { useEffect, useState } from "react"


const CurrencyInput = ({
    value,
    ...props
}) => {

    const [numValue, setNumValue] = useState('')
    const formatRupiah = (val) => {
        const number = val.replace(/[^\d.]/g, '')
        return new Intl.NumberFormat('en-EN').format(number)
    }

    const handleChange = (e) => {
        const raw = e.target.value
        console.log(raw);
        
        setNumValue(formatRupiah(raw))
    }

    useEffect(() => {
        setNumValue(formatRupiah(value))
    }, [])


  return (
    <Input value={numValue} onChange={handleChange} {...props} />
  )
}

export default CurrencyInput