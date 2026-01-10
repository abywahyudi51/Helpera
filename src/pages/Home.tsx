import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Sparkles, Wrench, Monitor, Car, ChevronRight, ShieldCheck, Clock, ThumbsUp } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-700 pb-24 md:pb-20 bg-gray-50/50">
      
      {/* 1. HERO SECTION */}
      {/* Update: Kurangi padding bawah di HP (pb-24 jadi pb-20) biar ga terlalu tinggi */}
      <div className="relative bg-[#0F3D85] text-white pt-8 pb-24 md:pt-16 md:pb-40 overflow-hidden rounded-b-[30px] md:rounded-b-[60px] shadow-sm">
        
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-64 h-64 md:w-96 md:h-96 bg-blue-400 opacity-20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-[10%] left-[-10%] w-72 h-72 md:w-[500px] md:h-[500px] bg-indigo-500 opacity-20 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-6 text-center md:text-left">
          
          {/* Header Mobile - Lebih Compact */}
          <div className="md:hidden flex justify-between items-center mb-6">
             <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <span className="text-sm font-bold tracking-tight">Helpera</span>
             </div>
             <div className="bg-white/10 p-2 rounded-full backdrop-blur-md border border-white/10">
                <Bell className="w-4 h-4" />
             </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="w-full md:w-2/3">
                <p className="text-blue-200 font-semibold tracking-wider text-[10px] md:text-sm uppercase mb-2 md:mb-3 flex items-center justify-center md:justify-start gap-2">
                    <span className="w-6 md:w-8 h-[2px] bg-blue-400 inline-block"></span> 
                    Solusi Harianmu
                </p>
                <h2 className="text-3xl md:text-6xl font-extrabold leading-tight mb-5 md:mb-6 tracking-tight">
                  Jasa Profesional <br className="hidden md:block"/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Tanpa Ribet.</span>
                </h2>
                
                {/* SEARCH BAR - Lebih Tipis di HP */}
                <div className="bg-white p-1.5 md:p-2 rounded-xl md:rounded-2xl shadow-xl flex items-center w-full md:max-w-xl mx-auto md:mx-0">
                    <Search className="text-gray-400 ml-2 md:ml-3 w-4 h-4 md:w-5 md:h-5" />
                    <input 
                        type="text" 
                        placeholder="Cari 'Cuci Mobil'..." 
                        className="w-full bg-transparent outline-none text-gray-700 px-2 md:px-3 py-2 md:py-3 text-sm md:text-base font-medium placeholder-gray-400" 
                    />
                    <button className="bg-[#0056b3] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-bold text-xs md:text-sm shadow-lg">
                        Cari
                    </button>
                </div>
            </div>

            {/* Ilustrasi Dekorasi (Desktop Only) */}
            <div className="hidden md:block w-1/3 relative">
                 <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center text-2xl">🧹</div>
                        <div>
                            <h4 className="font-bold text-lg">Pebersihan Rumah</h4>
                            <p className="text-xs text-blue-100">Sedang berjalan • 2 jam lagi</p>
                        </div>
                    </div>
                    <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-400 w-3/4 h-full"></div>
                    </div>
                 </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KATEGORI JASA */}
      {/* Update: Kurangi negative margin (-mt-16 di HP) dan padding container (px-4) */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 md:-mt-24 relative z-20">
        
        {/* Update: Padding dalam card dikurangi (p-5 di HP) biar ga makan tempat */}
        <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-xl border border-gray-100 p-5 md:p-10">
            
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-lg md:text-2xl font-bold text-gray-900 tracking-tight">Kategori</h3>
                <p className="text-gray-500 text-xs md:text-sm mt-0.5 font-medium">Layanan favorit minggu ini</p>
              </div>
              <Link to="/semua-kategori" className="text-[#0056b3] font-bold text-xs md:text-sm flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full">
                Semua <ChevronRight size={14} />
              </Link>
            </div>

            {/* Grid Kategori */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
              {[
                { icon: <Sparkles />, label: 'Cleaning', slug: 'kebersihan', desc: 'Rumah', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: <Wrench />, label: 'Tukang', slug: 'pertukangan', desc: 'Renovasi', color: 'text-orange-600', bg: 'bg-orange-50' },
                { icon: <Monitor />, label: 'Elektronik', slug: 'elektronik', desc: 'Service', color: 'text-purple-600', bg: 'bg-purple-50' },
                { icon: <Car />, label: 'Otomotif', slug: 'otomotif', desc: 'Bengkel', color: 'text-slate-700', bg: 'bg-slate-100' },
              ].map((item, i) => (
                <Link 
                    key={i} 
                    to={`/kategori/${item.slug}`} 
                    className="group flex flex-col md:flex-row items-center md:gap-4 p-3 md:p-4 rounded-2xl border border-gray-100 md:border-transparent bg-white md:hover:bg-gray-50 transition-all text-center md:text-left shadow-sm md:shadow-none"
                >
                  <div className={`${item.bg} ${item.color} w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-xl md:rounded-2xl mb-2 md:mb-0`}>
                    {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
                  </div>
                  <div>
                      <h4 className="font-bold text-gray-800 text-sm md:text-base">{item.label}</h4>
                      <p className="text-[10px] md:text-xs text-gray-400">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            
        </div>
      </div>

      {/* 3. SECTION PROMO */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl md:rounded-[2.5rem] p-6 md:p-12 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
                <div className="md:w-1/2">
                    <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-3 inline-block border border-yellow-500/20">Aman & Terpercaya</span>
                    <h3 className="text-xl md:text-4xl font-bold mb-2 md:mb-4 leading-tight">Garansi Kepuasan <br/>Pelanggan.</h3>
                    <div className="flex gap-3 mt-4">
                        <FeatureBadge icon={<ShieldCheck size={14}/>} text="Verifikasi" />
                        <FeatureBadge icon={<Clock size={14}/>} text="Tepat Waktu" />
                    </div>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

function FeatureBadge({ icon, text }: { icon: any, text: string }) {
    return (
        <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 text-xs font-bold">
            {icon} {text}
        </div>
    )
}

export default Home;