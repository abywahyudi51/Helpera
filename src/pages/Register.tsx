import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; 
import { auth, db } from '../lib/firebase';
import { User, Lock, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Buat User di Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Update Nama di Profile Auth agar bisa diakses via auth.currentUser.displayName
      await updateProfile(user, { displayName: formData.name });

      // 3. Simpan data lengkap ke Firestore
      // Setiap pendaftar baru secara otomatis menjadi "customer"
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: "customer", // <--- ROLE OTOMATIS
        points: 0,        // <--- Tambahkan poin awal agar fitur Akun tidak error
        totalOrders: 0,   // <--- Tambahkan tracker pesanan awal
        createdAt: serverTimestamp(),
      });

      toast.success("Akun Customer berhasil dibuat! 👋");
      navigate('/');
      
    } catch (error: any) {
      console.error(error);
      let errorMessage = "Terjadi kesalahan saat mendaftar.";

      if (error.code === 'auth/email-already-in-use') {
          errorMessage = "Email sudah terdaftar! Coba login saja.";
      } else if (error.code === 'auth/weak-password') {
          errorMessage = "Password terlalu lemah (minimal 6 karakter).";
      } else if (error.code === 'auth/invalid-email') {
          errorMessage = "Format email tidak valid.";
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-6 py-12 lg:px-8 animate-in fade-in zoom-in duration-500">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <h2 className="text-4xl font-black text-[#0F3D85] mb-2 tracking-tighter">Helpera</h2>
        <h3 className="text-xl font-bold tracking-tight text-gray-900">Gabung Jadi Customer</h3>
        <p className="text-gray-500 text-sm mt-1">Dapatkan kemudahan jasa profesional</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white p-8 rounded-[32px] shadow-xl border border-gray-100">
        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">Nama Lengkap</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><User size={18}/></div>
                <input type="text" required className="block w-full rounded-2xl border-0 py-4 pl-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#0F3D85] outline-none bg-gray-50/50 focus:bg-white transition-all text-sm"
                    placeholder="Contoh: Budi Santoso"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">Email</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Mail size={18}/></div>
                <input type="email" required className="block w-full rounded-2xl border-0 py-4 pl-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#0F3D85] outline-none bg-gray-50/50 focus:bg-white transition-all text-sm"
                    placeholder="nama@email.com"
                    value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">WhatsApp</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Phone size={18}/></div>
                <input type="tel" required className="block w-full rounded-2xl border-0 py-4 pl-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#0F3D85] outline-none bg-gray-50/50 focus:bg-white transition-all text-sm"
                    placeholder="0812xxxx"
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2">Password</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Lock size={18}/></div>
                <input type="password" required className="block w-full rounded-2xl border-0 py-4 pl-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-[#0F3D85] outline-none bg-gray-50/50 focus:bg-white transition-all text-sm"
                    placeholder="Minimal 6 karakter"
                    value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="flex w-full justify-center rounded-2xl bg-[#0F3D85] px-3 py-4 text-sm font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-800 disabled:opacity-50 mt-6 transition-all active:scale-95">
            {loading ? "Mendaftarkan Akun..." : "Daftar Akun Gratis"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500 font-medium">Sudah punya akun? <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500 underline decoration-blue-200 underline-offset-4">Masuk ke Sini</Link></p>
      </div>
    </div>
  );
}