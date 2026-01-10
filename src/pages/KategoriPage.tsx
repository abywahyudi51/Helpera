import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Sparkles, Wrench, Car, PaintBucket } from 'lucide-react';

const KategoriPage: React.FC = () => {
  const { slug } = useParams(); // Mengambil 'kebersihan', 'pertukangan', dll
  const navigate = useNavigate();

  // DATA: Daftar Sub-Jasa untuk setiap Kategori
  const subServices: any = {
    kebersihan: {
      title: 'Cleaning Service',
      desc: 'Solusi kebersihan untuk setiap sudut rumahmu.',
      bg: 'bg-blue-600',
      items: [
        { id: 'clean-kitchen', name: 'Cleaning Dapur', price: 'Rp 75.000', desc: 'Cuci piring, lap kabinet, pel lantai.' },
        { id: 'clean-bathroom', name: 'Cleaning Kamar Mandi', price: 'Rp 50.000', desc: 'Sikat lantai, kloset, dan wastafel.' },
        { id: 'clean-living', name: 'Cleaning Ruang Keluarga', price: 'Rp 60.000', desc: 'Vacuum sofa, karpet, dan debu jendela.' },
        { id: 'clean-full', name: 'Deep Cleaning Rumah', price: 'Rp 250.000', desc: 'Pembersihan total seluruh ruangan (Maks 100m²).' },
      ]
    },
    pertukangan: { // Ganti AC jadi ini
      title: 'Pertukangan & Renovasi',
      desc: 'Perbaikan rumah dan instalasi profesional.',
      bg: 'bg-orange-600',
      items: [
        { id: 'fix-roof', name: 'Perbaikan Atap Bocor', price: 'Rp 150.000', desc: 'Tambal atap dan cek aliran air.' },
        { id: 'paint-wall', name: 'Pengecatan Dinding', price: 'Rp 35.000/m²', desc: 'Jasa tukang cat (belum termasuk cat).' },
        { id: 'install-ac', name: 'Servis & Cuci AC', price: 'Rp 75.000', desc: 'Cuci AC Split dan cek Freon.' },
        { id: 'fix-plumbing', name: 'Pipa & Keran Air', price: 'Rp 100.000', desc: 'Perbaikan saluran mampet atau bocor.' },
      ]
    },
    otomotif: { // Ganti Tugas jadi ini
      title: 'Servis Otomotif',
      desc: 'Perawatan kendaraan tanpa perlu ke bengkel.',
      bg: 'bg-slate-800',
      items: [
        { id: 'wash-car', name: 'Cuci Mobil Home', price: 'Rp 60.000', desc: 'Cuci body dan vacuum interior.' },
        { id: 'oil-change', name: 'Ganti Oli Motor', price: 'Rp 50.000', desc: 'Jasa ganti oli (Oli dari customer/beli terpisah).' },
        { id: 'check-engine', name: 'Cek Mesin Ringan', price: 'Rp 100.000', desc: 'Diagnosa suara mesin kasar atau mogok.' },
      ]
    },
    elektronik: { // Pengganti Editing (Opsional/Bisa tetap Editing)
      title: 'Servis Elektronik',
      desc: 'Perbaikan gadget dan alat rumah tangga.',
      bg: 'bg-purple-600',
      items: [
        { id: 'fix-tv', name: 'Servis TV LED', price: 'Rp 200.000', desc: 'Perbaikan layar gelap atau tidak ada suara.' },
        { id: 'fix-laptop', name: 'Install Ulang Laptop', price: 'Rp 100.000', desc: 'Windows/MacOS + Office Standar.' },
      ]
    }
  };

  const currentCategory = subServices[slug || 'kebersihan'];

  // Jika kategori tidak ditemukan
  if (!currentCategory) return <div className="p-10 text-center">Kategori tidak ditemukan.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* Header Kategori */}
      <div className={`${currentCategory.bg} text-white pt-8 pb-16 px-6 rounded-b-[40px] shadow-lg relative`}>
        <button onClick={() => navigate(-1)} className="absolute top-6 left-4 bg-white/20 p-2 rounded-full hover:bg-white/30 transition">
            <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold mt-8">{currentCategory.title}</h1>
        <p className="text-white/80 mt-2 text-sm">{currentCategory.desc}</p>
      </div>

      {/* List Sub-Services */}
      <div className="px-4 -mt-10 relative z-10 space-y-4">
        {currentCategory.items.map((item: any, i: number) => (
            <Link 
                to={`/layanan/${item.id}`} 
                key={i}
                className="block bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all active:scale-95"
            >
                <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                    <span className="text-[#0056b3] font-bold text-sm bg-blue-50 px-2 py-1 rounded-lg">{item.price}</span>
                </div>
                <p className="text-gray-400 text-xs mb-3">{item.desc}</p>
                
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0056b3]">
                    Pesan Jasa <ChevronRight size={16} />
                </div>
            </Link>
        ))}
      </div>
    </div>
  );
};

export default KategoriPage;