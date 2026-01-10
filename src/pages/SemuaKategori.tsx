import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Wrench, Monitor, Car, Palette, Scissors, Truck, MoreHorizontal } from 'lucide-react';

const SemuaKategori: React.FC = () => {
  const navigate = useNavigate();

  // Daftar Lengkap Kategori
  const allCategories = [
    { icon: <Sparkles />, label: 'Cleaning', slug: 'kebersihan', desc: 'Rumah & Kantor', color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: <Wrench />, label: 'Pertukangan', slug: 'pertukangan', desc: 'Renovasi & AC', color: 'text-orange-600', bg: 'bg-orange-50' },
    { icon: <Monitor />, label: 'Elektronik', slug: 'elektronik', desc: 'Laptop & TV', color: 'text-purple-600', bg: 'bg-purple-50' },
    { icon: <Car />, label: 'Otomotif', slug: 'otomotif', desc: 'Mobil & Motor', color: 'text-slate-700', bg: 'bg-slate-100' },
    
    // --- Kategori Tambahan (Yang tidak muat di Home) ---
    { icon: <Palette />, label: 'Dekorasi', slug: 'dekorasi', desc: 'Cat & Interior', color: 'text-pink-600', bg: 'bg-pink-50' },
    { icon: <Scissors />, label: 'Cukur Rambut', slug: 'cukur', desc: 'Panggilan', color: 'text-teal-600', bg: 'bg-teal-50' },
    { icon: <Truck />, label: 'Angkut Barang', slug: 'angkut', desc: 'Pindahan', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { icon: <MoreHorizontal />, label: 'Lainnya', slug: 'lainnya', desc: 'Jasa Umum', color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* Header */}
      <div className="bg-white px-6 pt-8 pb-6 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition">
                <ArrowLeft size={24} className="text-gray-800" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Semua Kategori</h1>
        </div>
      </div>

      {/* Grid Kategori */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
            {allCategories.map((item, i) => (
                <Link 
                    key={i} 
                    to={`/kategori/${item.slug}`} 
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center gap-3 group"
                >
                    <div className={`${item.bg} ${item.color} w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                        {React.cloneElement(item.icon as React.ReactElement<any>, { size: 32 })}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800">{item.label}</h4>
                        <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                    </div>
                </Link>
            ))}
        </div>
      </div>

    </div>
  );
};

export default SemuaKategori;