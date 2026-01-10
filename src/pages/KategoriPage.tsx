import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Filter } from 'lucide-react';

// DATA KATEGORI & JASA
// ID di sini WAJIB sama dengan ID di DetailLayanan.tsx
const CATEGORY_DATA: any = {
  'kebersihan': {
    title: 'Kebersihan & Rumah Tangga',
    desc: 'Rumah bersih, bebas kuman, keluarga nyaman.',
    banner: 'https://images.unsplash.com/photo-1581578731117-104f2a41272c?w=800&q=80',
    services: [
      { id: 'clean-kitchen', title: 'Cleaning Dapur', price: 75000, rating: 4.8, image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&q=80' },
      { id: 'clean-bathroom', title: 'Cleaning Kamar Mandi', price: 50000, rating: 4.9, image: 'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?w=400&q=80' },
      { id: 'clean-living', title: 'Cleaning Ruang Tamu', price: 60000, rating: 4.7, image: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=400&q=80' },
      { id: 'ironing', title: 'Jasa Setrika', price: 40000, rating: 4.6, image: 'https://images.unsplash.com/photo-1489274495757-95c7c83700c0?w=400&q=80' },
    ]
  },
  'pertukangan': {
    title: 'Pertukangan & AC',
    desc: 'Solusi renovasi dan perbaikan teknis.',
    banner: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
    services: [
      { id: 'service-ac', title: 'Cuci AC Split', price: 75000, rating: 4.9, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80' },
      { id: 'fix-roof', title: 'Perbaikan Atap', price: 150000, rating: 4.8, image: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?w=400&q=80' },
      { id: 'paint-wall', title: 'Cat Dinding', price: 35000, rating: 4.5, image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&q=80' },
    ]
  },
  'otomotif': {
    title: 'Otomotif & Kendaraan',
    desc: 'Perawatan kendaraan tanpa perlu ke bengkel.',
    banner: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80',
    services: [
      { id: 'wash-car', title: 'Cuci Mobil Home', price: 60000, rating: 4.8, image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&q=80' },
      { id: 'oil-change', title: 'Ganti Oli Motor', price: 35000, rating: 4.7, image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=400&q=80' },
      { id: 'car-battery', title: 'Jumper Aki', price: 100000, rating: 4.9, image: 'https://images.unsplash.com/photo-1459603677915-a62079ffd002?w=400&q=80' },
    ]
  },
  'elektronik': {
    title: 'Service Elektronik',
    desc: 'Perbaikan TV, Kulkas, dan barang elektronik.',
    banner: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
    services: [
      { id: 'fix-tv', title: 'Service TV LED', price: 125000, rating: 4.6, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80' },
      { id: 'fix-fridge', title: 'Service Kulkas', price: 150000, rating: 4.7, image: 'https://images.unsplash.com/photo-1571175443880-49e1d58b95da?w=400&q=80' },
    ]
  },
  'lainnya': { // Kategori Penampung (Pijat, Cukur, Angkut)
    title: 'Layanan Lainnya',
    desc: 'Kebutuhan gaya hidup dan logistik.',
    banner: 'https://images.unsplash.com/photo-1512413914633-b5043f4041ea?w=800&q=80',
    services: [
      { id: 'massage', title: 'Pijat Refleksi', price: 90000, rating: 4.9, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80' },
      { id: 'haircut', title: 'Cukur Rambut', price: 45000, rating: 4.8, image: 'https://images.unsplash.com/photo-1585747627918-a757c5c4025d?w=400&q=80' },
      { id: 'moving', title: 'Angkut Barang', price: 250000, rating: 4.7, image: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21e?w=400&q=80' },
    ]
  }
};

export default function KategoriPage() {
  const { slug } = useParams(); // Ambil slug dari URL
  const navigate = useNavigate();

  // Ambil data berdasarkan slug, kalau tidak ada pakai 'lainnya'
  const category = CATEGORY_DATA[slug || 'lainnya'] || CATEGORY_DATA['lainnya'];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 animate-in slide-in-from-right duration-300">
      
      {/* Header Banner */}
      <div className="relative h-48 md:h-64 bg-gray-900">
        <img src={category.banner} alt={category.title} className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        <div className="absolute top-0 left-0 p-6 w-full h-full flex flex-col justify-between">
            <button onClick={() => navigate(-1)} className="self-start bg-white/20 backdrop-blur-md p-2 rounded-full hover:bg-white/30 transition text-white">
                <ArrowLeft />
            </button>
            <div>
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">{category.title}</h1>
                <p className="text-gray-200 text-sm md:text-base">{category.desc}</p>
            </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 px-6 py-4 overflow-x-auto no-scrollbar border-b border-gray-200 bg-white sticky top-0 z-10">
        <button className="flex items-center gap-2 bg-[#0F3D85] text-white px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap shadow-md">
            <Filter size={14} /> Semua
        </button>
        <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap hover:bg-gray-200">Terlaris</button>
        <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap hover:bg-gray-200">Harga Terendah</button>
      </div>

      {/* Grid Services */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {category.services.map((service: any) => (
            <Link 
                key={service.id} 
                to={`/layanan/${service.id}`} // LINK KE DETAIL LAYANAN
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-all active:scale-[0.98]"
            >
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{service.title}</h3>
                    <div className="flex items-center gap-1 text-yellow-500 mb-2">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-bold text-gray-600">{service.rating}</span>
                    </div>
                    <div className="mt-auto flex justify-between items-center">
                        <p className="text-[#0056b3] font-black">Rp{service.price.toLocaleString('id-ID')}</p>
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg font-bold">Pesan</span>
                    </div>
                </div>
            </Link>
        ))}
      </div>
    </div>
  );
}