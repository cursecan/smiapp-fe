export const formatRupiah = (v) => {
    const number = v.replace(/[^\d.]/g, '')
    return new Intl.NumberFormat('en-EN').format(number)
}