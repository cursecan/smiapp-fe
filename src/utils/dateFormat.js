import { format } from "date-fns"



export const useFormatDate = (dt) => {
    return format(dt, 'dd MMM yyyy HH:mm') + ' WIB'
} 