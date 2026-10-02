import * as z from "zod"



export const usePenawaranSchema = z.object({
    nama_project: z.string().min(1, 'Nama project tidak bolek kosong.'),
    nomor_penugasan: z.string().min(1, 'Nomor SPK/PO tidak boleh kosong.'),
    jenis_pekerjaan: z.string().min(1, 'Tidak memilih jenis pekerjaan.'),
    pelabuhan: z.string().min(1, 'Wilayah pelabuhan harus diisi.'),
   // FIXED: Ditambahkan z.string() di dalam z.array()
    multi_pelabuhan: z
        .array(z.string())
        .min(1, 'Pelabuhan harus dipilih minimal 1.'),
        
    // FIXED: Dibuat optional/nullable jika catatan tidak wajib diisi
    catatan: z.string().optional(),
    
    // FIXED: Ditambahkan validasi min(1) jika wajib, atau gunakan .optional() jika opsional
    tgl_surat: z.string().min(1, 'Tanggal surat tidak boleh kosong.'),
    kapal: z
        .array(z.string()).optional()
})

export const useOperasionalSchema = z.object()