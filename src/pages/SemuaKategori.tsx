import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Search, Star, ArrowRight, FilterX } from 'lucide-react';

export default function SemuaKategori() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ambil keyword dari state yang dikirim Home (kalau ada)
  const initialSearch = location.state?.searchQuery || '';
  const [search, setSearch] = useState(initialSearch);

  // DATA SEMUA LAYANAN (DATABASE SEMENTARA)
  const allServices = [
    { id: 'service-ac', name: 'Cuci AC Split', price: 75000, rating: 4.9, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80', category: 'Elektronik' },
    { id: 'clean-kitchen', name: 'Cleaning Dapur', price: 75000, rating: 4.8, image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80', category: 'Cleaning' },
    { id: 'clean-bathroom', name: 'Cleaning Kamar Mandi', price: 50000, rating: 4.9, image: 'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?w=800&q=80', category: 'Cleaning' },
    { id: 'wash-car', name: 'Cuci Mobil Home', price: 60000, rating: 4.8, image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80', category: 'Otomotif' },
    { id: 'oil-change', name: 'Ganti Oli Motor', price: 35000, rating: 4.7, image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80', category: 'Otomotif' },
    { id: 'massage', name: 'Pijat Refleksi', price: 90000, rating: 4.9, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', category: 'Kesehatan' },
    { id: 'fix-roof', name: 'Perbaikan Atap', price: 150000, rating: 4.6, image: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?w=800&q=80', category: 'Tukang' },
    { id: 'fix-tv', name: 'Service TV LED', price: 100000, rating: 4.5, image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80', category: 'Elektronik' },
  ];

  // LOGIKA FILTER
  const filteredServices = allServices.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-10 animate-in slide-in-from-right duration-300">
      
      {/* HEADER PENCARIAN */}
      <div className="bg-white p-4 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft size={24} className="text-gray-800"/>
            </button>
            <div className="flex-1 relative">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari layanan lain..."
                    className="w-full bg-gray-100 rounded-full py-2.5 pl-10 pr-4 outline-none text-gray-700 font-medium focus:bg-white focus:ring-2 focus:ring-[#0F3D85] transition-all"
                    autoFocus={!!initialSearch} // Autofocus jika datang dari hasil search home
                />
            </div>
        </div>

        {/* Filter Chips (Opsional) */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
             <button onClick={() => setSearch('')} className={`px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${search === '' ? 'bg-[#0F3D85] text-white border-[#0F3D85]' : 'bg-white text-gray-600 border-gray-200'}`}>
                Semua
             </button>
             {['Cleaning', 'Elektronik', 'Otomotif', 'Tukang'].map(cat => (
                 <button 
                    key={cat} 
                    onClick={() => setSearch(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${search === cat ? 'bg-[#0F3D85] text-white border-[#0F3D85]' : 'bg-white text-gray-600 border-gray-200'}`}
                 >
                    {cat}
                 </button>
             ))}
        </div>
      </div>

      {/* HASIL PENCARIAN */}
      <div className="p-4">
         {search && (
            <p className="text-sm text-gray-500 mb-4 ml-1">
                Menampilkan hasil untuk <span className="font-bold text-gray-900">"{search}"</span>
            </p>
         )}

         {filteredServices.length > 0 ? (
             <div className="grid grid-cols-1 gap-4">
                 {filteredServices.map((service) => (
                    <div 
                        key={service.id}
                        onClick={() => navigate(`/layanan/${service.id}`)}
                        className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-4 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]"
                    >
                        <div className="w-24 h-24 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md mb-1 inline-block">
                                    {service.category}
                                </span>
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{service.name}</h3>
                            <div className="flex items-center gap-1 mb-2">
                                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                <span className="text-xs font-bold text-gray-600">{service.rating}</span>
                            </div>
                            <div className="flex justify-between items-center mt-auto">
                                <p className="text-[#0F3D85] font-black">Rp{service.price.toLocaleString('id-ID')}</p>
                                <button className="bg-gray-50 p-1.5 rounded-full text-[#0F3D85]">
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                 ))}
             </div>
         ) : (
             <div className="flex flex-col items-center justify-center py-20 text-center">
                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FilterX size={32} className="text-gray-400" />
                 </div>
                 <h3 className="font-bold text-gray-900 mb-1">Layanan tidak ditemukan</h3>
                 <p className="text-sm text-gray-400">Coba cari dengan kata kunci lain.</p>
             </div>
         )}
      </div>

    </div>
  );
}