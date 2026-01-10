import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';

const DetailLayanan: React.FC = () => {
  const { kategori } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Data Dummy Tampilan
const details: any = {
    // === KEBERSIHAN ===
    'clean-kitchen': {
      title: 'Cleaning Dapur',
      price: 75000,
      image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
      desc: 'Membersihkan area dapur termasuk cuci piring menumpuk, lap kabinet luar, pembersihan kompor dari minyak, dan pel lantai.',
      rating: 4.8
    },
    'clean-bathroom': {
      title: 'Cleaning Kamar Mandi',
      price: 50000,
      image: 'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?w=800&q=80',
      desc: 'Sikat kerak lantai, pembersihan kloset, wastafel, dan cermin. Tidak termasuk kuras bak mandi besar.',
      rating: 4.9
    },
    'clean-living': {
        title: 'Cleaning Ruang Keluarga',
        price: 60000,
        image: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=800&q=80',
        desc: 'Vacuum sofa, karpet, membersihkan debu di rak TV dan jendela.',
        rating: 4.7
    },

    // === PERTUKANGAN (REPLACE AC) ===
    'fix-roof': {
        title: 'Perbaikan Atap Bocor',
        price: 150000,
        image: 'https://images.unsplash.com/photo-1632759145351-1d592919f522?w=800&q=80',
        desc: 'Pengecekan titik kebocoran dan penambalan ringan (maksimal 3 titik).',
        rating: 4.8
    },
    'install-ac': { // AC pindah ke sini
        title: 'Servis & Cuci AC',
        price: 75000,
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
        desc: 'Cuci unit indoor & outdoor. Garansi dingin 1 minggu.',
        rating: 4.9
    },

    // === OTOMOTIF (REPLACE TUGAS) ===
    'wash-car': {
        title: 'Cuci Mobil Home Service',
        price: 60000,
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80',
        desc: 'Penyedia jasa datang ke rumah. Cuci body, semir ban, dan vacuum interior.',
        rating: 4.8
    },
    'oil-change': {
        title: 'Ganti Oli Motor',
        price: 50000,
        image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80',
        desc: 'Jasa mekanik panggilan untuk ganti oli. Harga jasa saja.',
        rating: 4.7
    }
    // ... Kamu bisa tambahkan sisanya sesuai id di KategoriPage
  };

  const service = details[kategori || 'kebersihan'] || details['kebersihan'];

  const handleBooking = async () => {
    // Mode Demo: Simulasi sukses tanpa database
    const confirm = window.confirm(`[DEMO] Pesan jasa ${service.title}?`);
    if (confirm) {
        setLoading(true);
        setTimeout(() => {
            alert("Berhasil! (Simulasi)");
            navigate('/riwayat');
            setLoading(false);
        }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24 md:pt-20">
      <div className="absolute top-4 left-4 z-10 md:hidden">
        <button onClick={() => navigate(-1)} className="bg-white/80 p-2 rounded-full shadow-md backdrop-blur-sm">
            <ArrowLeft size={24} className="text-gray-800"/>
        </button>
      </div>

      <div className="h-64 md:h-80 w-full relative">
        <img src={service.image} alt={service.title} className="w-full h-full object-cover md:rounded-b-3xl" />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/60 to-transparent md:rounded-b-3xl"></div>
      </div>

      <div className="px-6 py-6 -mt-8 relative z-20 bg-white rounded-t-[30px] md:mt-0 md:rounded-none md:max-w-4xl md:mx-auto">
        <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mb-2">{service.title}</h1>
        <p className="text-2xl font-black text-[#0056b3] mb-6">Rp {service.price.toLocaleString('id-ID')}</p>
        
        <div className="space-y-6">
            <div>
                <h3 className="font-bold text-gray-900 mb-2">Deskripsi</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <Clock size={20} className="text-gray-400"/>
                    <div><p className="text-xs text-gray-400">Estimasi</p><p className="font-bold text-gray-800 text-sm">60 Menit</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <MapPin size={20} className="text-gray-400"/>
                    <div><p className="text-xs text-gray-400">Lokasi</p><p className="font-bold text-gray-800 text-sm">Di Tempatmu</p></div>
                </div>
            </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t border-gray-100 md:relative md:border-none md:p-0 md:mt-8">
            <button 
                onClick={handleBooking}
                disabled={loading}
                className="w-full bg-[#0056b3] text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all disabled:bg-gray-300"
            >
                {loading ? 'Memproses...' : 'Pesan Sekarang (Demo)'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default DetailLayanan;