import * as z from "zod"



export const usePenawaranSchema = z.object({
    nama_project: z.string().min(1, 'Nama project tidak bolek kosong.'),
    nomor_penugasan: z.string().min(1, 'Nomor SPK/PO tidak boleh kosong.'),
    jenis_pekerjaan: z.string().min(1, 'Tidak memilih jenis pekerjaan.'),
    pelabuhan: z.string().min(1, 'Wilayah pelabuhan harus diisi.'),
    catatan: z.string(),
    tgl_surat: z.string(),
    // kapal: z.array().min(1, 'Kapal harus dipilih.')
})