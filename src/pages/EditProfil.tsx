import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Phone, Loader2, Camera } from 'lucide-react'; // Tambah Icon Camera
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // <--- GANTI updateDoc JADI setDoc
import { updateProfile } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function EditProfil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // State Form
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    photoURL: '' // Tambah state foto
  });

  // 1. AMBIL DATA USER SAAT INI
  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || user.displayName || '',
            phone: data.phone || '',
            photoURL: data.photoURL || user.photoURL || ''
          });
        } else {
            setFormData({
                name: user.displayName || '',
                phone: '',
                photoURL: user.photoURL || ''
            });
        }
      } catch (error) {
        console.error("Error fetch:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  // Fungsi Ganti Foto Random
  const handleRandomPhoto = () => {
    const randomId = Math.floor(Math.random() * 10000);
    const newPhoto = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomId}`;
    setFormData({ ...formData, photoURL: newPhoto });
    toast.success("Foto baru dipilih! (Klik Simpan)");
  };

  // 2. SIMPAN PERUBAHAN
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const user = auth.currentUser;

    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      
      // PERBAIKAN DI SINI: Pakai setDoc + merge: true
      // Ini akan membuat dokumen jika belum ada, atau mengupdate jika sudah ada
      await setDoc(userRef, {
        name: formData.name,
        phone: formData.phone,
        photoURL: formData.photoURL
      }, { merge: true });

      // Update Auth Profile
      await updateProfile(user, {
        displayName: formData.name,
        photoURL: formData.photoURL
      });

      toast.success("Profil berhasil disimpan! ✅");
      navigate('/akun');
    } catch (error: any) {
      console.error("Error saving:", error);
      toast.error("Gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Memuat data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="bg-white p-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-800"/>
        </button>
        <h1 className="text-xl font-bold text-gray-900">Ubah Profil</h1>
      </div>

      <div className="max-w-md mx-auto p-6">
        
        {/* Foto Profil */}
        <div className="flex justify-center mb-8">
            <div className="relative group cursor-pointer" onClick={handleRandomPhoto}>
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                    {formData.photoURL ? (
                        <img src={formData.photoURL} alt="Profil" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                            {formData.name.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="absolute bottom-0 right-0 bg-[#0F3D85] p-2 rounded-full border-2 border-white shadow-sm">
                    <Camera size={14} className="text-white" />
                </div>
            </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
            
            {/* Input Nama */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-1">Nama Lengkap</label>
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 focus-within:border-[#0F3D85] focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-sm">
                    <User size={20} className="text-gray-400" />
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="flex-1 bg-transparent outline-none text-gray-800 font-medium placeholder:text-gray-300"
                        placeholder="Nama kamu"
                        required
                    />
                </div>
            </div>

            {/* Input No WA */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-1">Nomor WhatsApp</label>
                <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-200 focus-within:border-[#0F3D85] focus-within:ring-2 focus-within:ring-blue-100 transition-all shadow-sm">
                    <Phone size={20} className="text-gray-400" />
                    <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="flex-1 bg-transparent outline-none text-gray-800 font-medium placeholder:text-gray-300"
                        placeholder="08xxxxxxxx"
                    />
                </div>
            </div>

            {/* Tombol Simpan */}
            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#0F3D85] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-800 active:scale-95 transition-all flex justify-center items-center gap-2 mt-8 disabled:opacity-70"
            >
                {loading ? (
                    <><Loader2 size={24} className="animate-spin" /> Menyimpan...</>
                ) : (
                    <><Save size={24} /> Simpan Perubahan</>
                )}
            </button>

        </form>
      </div>
    </div>
  );
}