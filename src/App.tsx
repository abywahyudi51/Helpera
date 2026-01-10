import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Komponen Layout & Proteksi
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Halaman Utama
import Home from './pages/Home';
import Riwayat from './pages/Riwayat';
import ChatList from './pages/ChatList';
import Akun from './pages/Akun';

// Halaman Detail / Full Screen
import DetailLayanan from './pages/DetailLayanan';
import ChatRoom from './pages/ChatRoom';
import EditProfil from './pages/EditProfil';
import MetodePembayaran from './pages/MetodePembayaran';
import Keamanan from './pages/Keamanan';
import Bantuan from './pages/Bantuan';
import Notifikasi from './pages/Notifikasi'; // <--- 1. IMPORT INI
import KategoriPage from './pages/KategoriPage';
import SemuaKategori from './pages/SemuaKategori';
import MitraDashboard from './pages/MitraDashboard';
import MitraChat from './pages/MitraChat';

// Halaman Auth
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      {/* Notifikasi (Toast) */}
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
          },
        }} 
      />

      <Routes>
        
        {/* === AREA WAJIB LOGIN (Protected) === */}
        <Route element={<ProtectedRoute />}>
            
            {/* GRUP 1: Halaman dengan Navbar Bawah (Layout) */}
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/riwayat" element={<Riwayat />} />
                <Route path="/chat" element={<ChatList />} />
                <Route path="/akun" element={<Akun />} />
                
                <Route path="/semua-kategori" element={<SemuaKategori />} />
                <Route path="/kategori/:slug" element={<KategoriPage />} />
            </Route>

            {/* GRUP 2: Halaman Layar Penuh (Tanpa Navbar Bawah) */}
            <Route path="/layanan/:id" element={<DetailLayanan />} />
            <Route path="/chat/:id" element={<ChatRoom />} />
            
            {/* Halaman Pengaturan Akun */}
            <Route path="/edit-profil" element={<EditProfil />} />
            <Route path="/metode-pembayaran" element={<MetodePembayaran />} />
            <Route path="/keamanan" element={<Keamanan />} />
            <Route path="/bantuan" element={<Bantuan />} />
            
            {/* Halaman Notifikasi */}
            <Route path="/notifikasi" element={<Notifikasi />} /> 
            <Route path="/mitra-dashboard" element={<MitraDashboard />} />
            <Route path="/mitra-chat/:id" element={<MitraChat />} />{/* <--- 2. DAFTARKAN DISINI */}
            
        </Route>

        {/* === AREA PUBLIK (Login & Register) === */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
    </Router>
  );
}

export default App;