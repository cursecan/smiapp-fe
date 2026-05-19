import { format } from "date-fns"



export const formatDate = (dt) => {
    return format(dt, 'dd MMM yyyy HH:mm') + ' WIB'
} 