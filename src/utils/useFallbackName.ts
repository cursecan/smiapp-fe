export const fallbackName = (t:string) => {
    const l_name = t.toUpperCase().split(' ', 2)

    if (l_name.length === 2) {
        return `${l_name[0][0]}${l_name[1][0]}`
    }

    return l_name.slice(0,2)
}