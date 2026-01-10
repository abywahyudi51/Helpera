import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CreditCard, Trash2, Smartphone, Building2, X, Loader2 } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, query, onSnapshot, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function MetodePembayaran() {
  const navigate = useNavigate();
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [newCard, setNewCard] = useState({
    type: 'E-Wallet', // E-Wallet atau Bank
    provider: 'GoPay',
    number: '',
    holder: ''
  });

  // 1. LOAD DATA REALTIME
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Sub-collection: users -> [uid] -> paymentMethods
    const q = query(collection(db, "users", user.uid, "paymentMethods"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMethods(data);
        setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. TAMBAH METODE BARU
  const handleAddMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const user = auth.currentUser;
    if (!user) return;

    try {
        await addDoc(collection(db, "users", user.uid, "paymentMethods"), {
            ...newCard,
            createdAt: serverTimestamp()
        });
        toast.success("Metode pembayaran berhasil ditambahkan!");
        setShowModal(false);
        setNewCard({ type: 'E-Wallet', provider: 'GoPay', number: '', holder: '' }); // Reset form
    } catch (error) {
        toast.error("Gagal menambahkan.");
    } finally {
        setSaving(false);
    }
  };

  // 3. HAPUS METODE
  const handleDelete = async (id: string) => {
    if(!window.confirm("Hapus metode pembayaran ini?")) return;
    const user = auth.currentUser;
    if(!user) return;

    try {
        await deleteDoc(doc(db, "users", user.uid, "paymentMethods", id));
        toast.success("Dihapus.");
    } catch (error) {
        toast.error("Gagal menghapus.");
    }
  };

  // Helper: Warna Kartu Berdasarkan Provider
  const getCardStyle = (provider: string) => {
    switch(provider) {
        case 'BCA': return 'bg-gradient-to-r from-blue-700 to-blue-500';
        case 'Mandiri': return 'bg-gradient-to-r from-yellow-600 to-yellow-400';
        case 'BNI': return 'bg-gradient-to-r from-orange-600 to-orange-400';
        case 'GoPay': return 'bg-gradient-to-r from-blue-400 to-green-400';
        case 'OVO': return 'bg-gradient-to-r from-purple-700 to-purple-500';
        case 'Dana': return 'bg-gradient-to-r from-blue-600 to-blue-400';
        default: return 'bg-gradient-to-r from-gray-700 to-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-in slide-in-from-right duration-300">
      
      {/* HEADER */}
      <div className="bg-white p-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={24} className="text-gray-800"/>
        </button>
        <h1 className="text-xl font-bold text-gray-900">Metode Pembayaran</h1>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-6">
        
        {/* TOMBOL TAMBAH */}
        <button 
            onClick={() => setShowModal(true)}
            className="w-full border-2 border-dashed border-blue-300 bg-blue-50 text-blue-600 rounded-2xl p-4 flex items-center justify-center gap-2 font-bold hover:bg-blue-100 transition-colors"
        >
            <Plus size={20} /> Tambah Metode Baru
        </button>

        {/* LIST KARTU */}
        {loading ? (
            <div className="text-center text-gray-400 py-10">Memuat data...</div>
        ) : methods.length === 0 ? (
            <div className="text-center text-gray-400 py-10">
                <CreditCard size={48} className="mx-auto mb-3 opacity-20" />
                <p>Belum ada metode pembayaran tersimpan.</p>
            </div>
        ) : (
            methods.map((method) => (
                <div key={method.id} className={`relative rounded-2xl p-6 text-white shadow-lg ${getCardStyle(method.provider)} overflow-hidden group`}>
                    
                    {/* Hiasan Background */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                            {method.type === 'Bank' ? <Building2 size={16}/> : <Smartphone size={16}/>}
                            <span className="text-xs font-bold uppercase tracking-wider">{method.provider}</span>
                        </div>
                        <button onClick={() => handleDelete(method.id)} className="p-2 bg-black/20 hover:bg-red-500 rounded-full transition-colors">
                            <Trash2 size={16} />
                        </button>
                    </div>

                    <div className="mb-4">
                        <p className="text-xs text-white/70 mb-1">Nomor Kartu / HP</p>
                        <p className="text-xl font-mono tracking-widest text-shadow">{method.number}</p>
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs text-white/70">Pemilik</p>
                            <p className="font-bold truncate max-w-[150px]">{method.holder}</p>
                        </div>
                        <CreditCard size={32} className="opacity-50" />
                    </div>
                </div>
            ))
        )}
      </div>

      {/* === MODAL TAMBAH === */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white w-full max-w-sm rounded-t-3xl md:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Tambah Metode</h3>
                    <button onClick={() => setShowModal(false)} className="p-1 bg-gray-100 rounded-full"><X size={20}/></button>
                </div>

                <form onSubmit={handleAddMethod} className="space-y-4">
                    
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Tipe</label>
                        <div className="flex gap-2">
                            {['E-Wallet', 'Bank'].map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setNewCard({...newCard, type})}
                                    className={`flex-1 py-2 rounded-xl text-sm font-bold border transition-all ${newCard.type === type ? 'bg-[#0F3D85] text-white border-[#0F3D85]' : 'bg-white text-gray-500 border-gray-200'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Provider</label>
                        <select 
                            className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-200 focus:border-blue-500"
                            value={newCard.provider}
                            onChange={(e) => setNewCard({...newCard, provider: e.target.value})}
                        >
                            {newCard.type === 'E-Wallet' ? (
                                <>
                                    <option value="GoPay">GoPay</option>
                                    <option value="OVO">OVO</option>
                                    <option value="Dana">Dana</option>
                                </>
                            ) : (
                                <>
                                    <option value="BCA">BCA</option>
                                    <option value="Mandiri">Mandiri</option>
                                    <option value="BNI">BNI</option>
                                </>
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Nomor {newCard.type === 'Bank' ? 'Rekening' : 'HP'}</label>
                        <input 
                            type="tel" 
                            required
                            placeholder="Contoh: 0812345..."
                            className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-200 focus:border-blue-500 font-mono"
                            value={newCard.number}
                            onChange={(e) => setNewCard({...newCard, number: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">Nama Pemilik</label>
                        <input 
                            type="text" 
                            required
                            placeholder="Nama sesuai akun"
                            className="w-full p-3 bg-gray-50 rounded-xl outline-none border border-gray-200 focus:border-blue-500"
                            value={newCard.holder}
                            onChange={(e) => setNewCard({...newCard, holder: e.target.value})}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={saving}
                        className="w-full bg-[#0F3D85] text-white py-3 rounded-xl font-bold shadow-lg hover:bg-blue-800 transition-all mt-4 flex justify-center"
                    >
                        {saving ? <Loader2 className="animate-spin"/> : "Simpan Metode"}
                    </button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}