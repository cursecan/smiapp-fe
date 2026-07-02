import { format } from "date-fns"



export const formatDate = (dt) => {
    return format(dt, 'dd MMM yyyy HH:mm') + ' WIB'
}

export const formatSimpleDate = (dt:Date) => {
    return format(dt, 'dd MMM yyyy')
}

export const formatSimpleDate2 = (dt) => {
    return format(dt, 'dd/MM/yyyy')
}
