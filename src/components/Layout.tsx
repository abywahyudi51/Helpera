import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, History, User, Menu } from 'lucide-react';
import logoHelpera from '../assets/logo-helpera.png'; // Pastikan path logo benar

export default function Layout() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      {/* === TAMPILAN DESKTOP (Top Navbar) === */}
      {/* 'hidden md:flex' artinya: Tersembunyi di HP, Tampil Flex di Desktop */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 h-16 items-center justify-between px-8 shadow-sm">
        
        {/* Logo di Kiri */}
        <div className="flex items-center gap-2">
           {/* Ganti src dengan logo kamu jika ada, atau teks */}
           <h1 className="text-xl font-bold text-[#0056b3]">Helpera</h1>
        </div>

        {/* Menu di Kanan */}
        <div className="flex items-center gap-8">
          <DesktopNavLink to="/" label="Beranda" active={isActive('/')} />
          <DesktopNavLink to="/riwayat" label="Riwayat" active={isActive('/riwayat')} />
          <DesktopNavLink to="/chat" label="Chat" active={isActive('/chat')} />
          <DesktopNavLink to="/akun" label="Akun" active={isActive('/akun')} />
        </div>
      </nav>

      {/* === AREA KONTEN UTAMA === */}
      {/* Tambahkan padding-top di desktop (md:pt-20) agar tidak tertutup navbar atas */}
      <main className="pb-24 md:pb-0 md:pt-20 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      {/* === TAMPILAN MOBILE (Bottom Navbar) === */}
      {/* 'md:hidden' artinya: Sembunyikan jika layar Desktop */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0056b3] text-white border-t border-blue-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 rounded-t-2xl">
        <div className="flex justify-around items-center h-20 px-2">
          <MobileNavItem to="/" icon={<Home size={24} />} label="Beranda" active={isActive('/')} />
          <MobileNavItem to="/chat" icon={<MessageCircle size={24} />} label="Chat" active={isActive('/chat')} />
          <MobileNavItem to="/riwayat" icon={<History size={24} />} label="Riwayat" active={isActive('/riwayat')} />
          <MobileNavItem to="/akun" icon={<User size={24} />} label="Akun" active={isActive('/akun')} />
        </div>
      </div>

    </div>
  );
}

// Komponen Kecil: Item Menu Mobile
function MobileNavItem({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link to={to} className={`flex flex-col items-center justify-center w-full h-full transition-all ${active ? 'text-white scale-110' : 'text-blue-200 hover:text-white'}`}>
      <div className={`${active ? 'bg-white/20 p-2 rounded-xl mb-1 shadow-sm' : 'mb-1'}`}>
        {icon}
      </div>
      <span className="text-[11px] font-medium">{label}</span>
    </Link>
  );
}

// Komponen Kecil: Item Menu Desktop
function DesktopNavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link 
      to={to} 
      className={`text-sm font-medium transition-colors hover:text-[#0056b3] ${active ? 'text-[#0056b3] font-bold border-b-2 border-[#0056b3] pb-1' : 'text-gray-500'}`}
    >
      {label}
    </Link>
  );
}