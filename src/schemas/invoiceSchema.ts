import * as z from "zod"



export const useInvoiceSchema = z.object({
    nomor_invoice: z.string().min(1, 'Nomor tidak boleh kosong.'),
    // nomor_penugasan: z.string().min(1, 'Nomor SPK/PO tidak boleh kosong.'),
    // jenis_pekerjaan: z.string().min(1, 'Tidak memilih jenis pekerjaan.'),
    // pelabuhan: z.string().min(1, 'Wilayah pelabuhan harus diisi.'),
    // catatan: z.string(),
    // tgl_surat: z.string(),
    // kapal: z.array().min(1, 'Kapal harus dipilih.')
})

export const useOperasionalSchema = z.object()