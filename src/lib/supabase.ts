import { createClient } from '@supabase/supabase-js';

// Ambil URL dan Key dari env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// LOGIKA PENGAMAN:
// Jika URL ada isinya -> Buat koneksi asli
// Jika URL kosong -> Buat koneksi palsu (dummy) agar aplikasi TIDAK CRASH (Layar Putih)
export const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : {
      // Ini adalah objek palsu agar halaman Riwayat tidak error saat loading
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: [], error: null }),
        update: () => Promise.resolve({ data: [], error: null }),
        eq: () => ({ 
             update: () => Promise.resolve({ error: null }) 
        }),
        order: () => Promise.resolve({ data: [], error: null }),
      })
    } as any;