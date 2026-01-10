import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Key, Eye, EyeOff, CheckCircle2, AlertCircle, Mail, Save } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { updatePassword, updateEmail } from 'firebase/auth'; // Import updateEmail
import { doc, updateDoc } from 'firebase/firestore'; // Import updateDoc
import toast from 'react-hot-toast';

export default function Keamanan() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'password' | 'email'>('password');
  const [loading, setLoading] = useState(false);
  
  // State Password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // State Email
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // Ambil email saat ini
  useEffect(() => {
    if (auth.currentUser?.email) {
        setCurrentEmail(auth.currentUser.email);
    }
  }, []);

  // 1. FUNGSI GANTI PASSWORD
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
        toast.error("Password minimal 6 karakter");
        return;
    }
    if (newPassword !== confirmPassword) {
        toast.error("Konfirmasi password tidak cocok");
        return;
    }

    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
        await updatePassword(user, newPassword);
        toast.success("Password berhasil diubah! 🔒");
        setNewPassword('');
        setConfirmPassword('');
    } catch (error: any) {
        console.error(error);
        if (error.code === 'auth/requires-recent-login') {
            toast.error("Demi keamanan, silakan Logout & Login dulu sebelum ganti password.");
        } else {
            toast.error("Gagal mengubah password.");
        }
    } finally {
        setLoading(false);
    }
  };

  // 2. FUNGSI GANTI EMAIL
  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.includes('@')) {
        toast.error("Format email tidak valid");
        return;
    }
    if (newEmail === currentEmail) {
        toast.error("Email baru sama dengan email lama");
        return;
    }

    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
        // A. Update di Auth (Login)
        await updateEmail(user, newEmail);
        
        // B. Update di Database Firestore (Tampilan Profil)
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { email: newEmail });

        toast.success("Email berhasil diperbarui! 📧");
        setCurrentEmail(newEmail); // Update tampilan
        setNewEmail('');
    } catch (error: any) {
        console.error(error);
        if (error.code === 'auth/requires-recent-login') {
            toast.error("Demi keamanan, silakan Logout & Login dulu sebelum ganti email.");
        } else if (error.code === 'auth/email-already-in-use') {
            toast.error("Email ini sudah digunakan akun lain.");
        } else {
            toast.error("Gagal mengubah email.");
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-in slide-in-from-right duration-300">
      
      {/* HEADER */}
      <div className="bg-white p-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-800"/>
        </button>
        <h1 className="text-xl font-bold text-gray-900">Keamanan & Akun</h1>
      </div>

      <div className="max-w-md mx-auto p-6">
        
        {/* TABS MENU */}
        <div className="flex p-1 bg-gray-200 rounded-xl mb-6">
            <button 
                onClick={() => setActiveTab('password')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'password' ? 'bg-white text-[#0F3D85] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Lock size={16} /> Password
            </button>
            <button 
                onClick={() => setActiveTab('email')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'email' ? 'bg-white text-[#0F3D85] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <Mail size={16} /> Email
            </button>
        </div>

        {/* --- FORM GANTI PASSWORD --- */}
        {activeTab === 'password' && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-start gap-3 mb-6">
                    <div className="bg-white p-2 rounded-full shadow-sm text-blue-600">
                        <Key size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-blue-800 text-sm">Ganti Kata Sandi</h3>
                        <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                            Gunakan kombinasi yang kuat. Jangan berikan password kepada siapapun.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Password Baru</label>
                        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                            <Lock size={20} className="text-gray-400" />
                            <input 
                                type={showPass ? "text" : "password"} 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-gray-800 font-medium placeholder:text-gray-300"
                                placeholder="Minimal 6 karakter"
                                required
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="text-gray-400 hover:text-gray-600">
                                {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Ulangi Password</label>
                        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                            <CheckCircle2 size={20} className={newPassword && newPassword === confirmPassword ? "text-green-500" : "text-gray-400"} />
                            <input 
                                type={showPass ? "text" : "password"} 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-gray-800 font-medium placeholder:text-gray-300"
                                placeholder="Ketik ulang password"
                                required
                            />
                        </div>
                        {confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-xs text-red-500 flex items-center gap-1 ml-1">
                                <AlertCircle size={12} /> Password tidak cocok
                            </p>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || !newPassword || newPassword !== confirmPassword}
                        className="w-full bg-[#0F3D85] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-800 active:scale-95 transition-all flex justify-center items-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Menyimpan..." : "Update Password"}
                    </button>
                </form>
            </div>
        )}

        {/* --- FORM GANTI EMAIL --- */}
        {activeTab === 'email' && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-start gap-3 mb-6">
                    <div className="bg-white p-2 rounded-full shadow-sm text-orange-600">
                        <Mail size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-orange-800 text-sm">Ganti Alamat Email</h3>
                        <p className="text-xs text-orange-600 mt-1 leading-relaxed">
                            Email saat ini: <b>{currentEmail}</b>. Pastikan email baru aktif untuk verifikasi di masa depan.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleChangeEmail} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email Baru</label>
                        <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
                            <Mail size={20} className="text-gray-400" />
                            <input 
                                type="email" 
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-gray-800 font-medium placeholder:text-gray-300"
                                placeholder="nama@email.com"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading || !newEmail}
                        className="w-full bg-[#0F3D85] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-800 active:scale-95 transition-all flex justify-center items-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Menyimpan..." : <><Save size={20}/> Simpan Email Baru</>}
                    </button>
                </form>
            </div>
        )}

      </div>
    </div>
  );
}