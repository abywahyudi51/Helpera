import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Lock, Mail, Loader2, User, Briefcase, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('customer'); 
  const navigate = useNavigate();

  // Email Khusus Mitra Utama
  const ADMIN_EMAIL = "abyarg99@gmail.com";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Eksekusi Login Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Cek Role jika login sebagai Mitra
      if (loginType === 'mitra') {
          if (user.email === ADMIN_EMAIL) {
              // Cek verifikasi tambahan ke Firestore untuk memastikan role "mitra"
              const userDoc = await getDoc(doc(db, "users", user.uid));
              if (userDoc.exists() && userDoc.data().role === 'mitra') {
                  toast.success("Akses Mitra Diterima. Selamat Datang Bos! 🛠️");
                  navigate('/mitra-dashboard');
              } else {
                  toast.error("Akun Anda tidak memiliki otoritas Mitra.");
                  setLoginType('customer');
              }
          } else {
              toast.error("Email ini tidak terdaftar sebagai Mitra.");
              setLoginType('customer');
          }
      } else {
          toast.success("Login Berhasil! 👋");
          navigate('/');
      }
    } catch (error: any) {
      toast.error("Email atau Password salah.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-6 py-12 lg:px-8 animate-in fade-in duration-500">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center mb-8">
        <h2 className="text-4xl font-black text-[#0F3D85] mb-2 tracking-tighter">Helpera</h2>
        <p className="text-gray-500 font-medium text-sm">Pilih Jalur Akses Anda</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* TABS SELECTOR */}
        <div className="flex bg-gray-200/50 p-1.5 rounded-2xl mb-6">
          <button 
            onClick={() => setLoginType('customer')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${loginType === 'customer' ? 'bg-white text-[#0F3D85] shadow-sm' : 'text-gray-500'}`}
          >
            <User size={18} /> Customer
          </button>
          <button 
            onClick={() => setLoginType('mitra')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${loginType === 'mitra' ? 'bg-[#10b981] text-white shadow-sm' : 'text-gray-500'}`}
          >
            <Briefcase size={18} /> Mitra
          </button>
        </div>

        <div className={`bg-white p-8 rounded-[32px] shadow-xl border transition-all duration-500 ${loginType === 'mitra' ? 'border-emerald-200 shadow-emerald-100' : 'border-gray-100 shadow-blue-100'}`}>
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900">
                {loginType === 'customer' ? 'Login Customer' : 'Login Khusus Mitra'}
            </h3>
            <p className="text-sm text-gray-400">
                {loginType === 'customer' ? 'Masuk untuk memesan jasa' : 'Hanya untuk pemilik Portal Helpera'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block w-full rounded-2xl border-0 py-4 pl-12 text-sm ring-1 ring-gray-200 outline-none transition-all ${loginType === 'mitra' ? 'focus:ring-[#10b981]' : 'focus:ring-[#0F3D85]'}`}
                placeholder="Email Akun"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block w-full rounded-2xl border-0 py-4 pl-12 text-sm ring-1 ring-gray-200 outline-none transition-all ${loginType === 'mitra' ? 'focus:ring-[#10b981]' : 'focus:ring-[#0F3D85]'}`}
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`flex w-full justify-center items-center gap-2 rounded-2xl px-3 py-4 text-sm font-bold text-white shadow-lg active:scale-95 transition-all ${loginType === 'mitra' ? 'bg-[#10b981] hover:bg-emerald-600 shadow-emerald-100' : 'bg-[#0F3D85] hover:bg-blue-800 shadow-blue-100'}`}
            >
              {loading ? (
                  <Loader2 size={20} className="animate-spin" />
              ) : (
                  <>{loginType === 'customer' ? 'Masuk Sekarang' : 'Buka Dashboard Mitra'}</>
              )}
            </button>
          </form>

          {loginType === 'customer' && (
              <p className="mt-8 text-center text-sm text-gray-500">
                Belum punya akun? <Link to="/register" className="font-bold text-blue-600 underline">Daftar</Link>
              </p>
          )}
          
          {loginType === 'mitra' && (
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
                  <ShieldCheck size={14} /> Terproteksi Enkripsi
              </div>
          )}
        </div>
      </div>
    </div>
  );
}