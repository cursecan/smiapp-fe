import * as z from 'zod'


export const useCasbonSchema = z.object({
    // pembayaran: z.boolean().default(true),
    // casbon: z.boolean().default(false),
    // petty_cash: z.boolean().default(false),
    pcp: z.array(z.string()).default([]),
    type_pembayaran: z.string().min(1, 'Type pembayaran harus diisi'),
    pph_rate: z.float32().default(0.02),
    is_ppn: z.boolean().default(false),
    supplier: z.string().min(1, 'Supllier harus diisi')
})