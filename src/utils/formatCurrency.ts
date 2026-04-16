export const formatRupiah = (v) => {
    const number = String(v).replace(/[^\d.]/g, '')
    return new Intl.NumberFormat('en-EN').format(number)
}