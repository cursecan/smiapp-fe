import * as z from 'zod'


export const useCasbonSchema = z.object({
    pcp: z.array(z.string()).default([]),
    type_pembayaran: z.string().min(1, 'Type pembayaran harus diisi'),
    pph_rate: z.float32().default(0),
    is_ppn: z.boolean().default(false),
    supplier: z.string().nullable().default('')
})