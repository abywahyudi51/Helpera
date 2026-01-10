import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Riwayat from './pages/Riwayat';
import ChatList from './pages/ChatList';
import Akun from './pages/Akun';
import DetailLayanan from './pages/DetailLayanan';
import KategoriPage from './pages/KategoriPage';
import SemuaKategori from './pages/SemuaKategori';
import ChatRoom from './pages/ChatRoom'; // <--- Import Baru

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/riwayat" element={<Riwayat />} />
        <Route path="/chat" element={<ChatList />} />
        <Route path="/akun" element={<Akun />} />
        <Route path="/kategori/:slug" element={<KategoriPage />} />
        <Route path="/layanan/:kategori" element={<DetailLayanan />} />
        <Route path="/semua-kategori" element={<SemuaKategori />} />
      </Route>

      {/* Halaman Chat Room (Di luar Layout agar Full Screen) */}
      <Route path="/chat/:id" element={<ChatRoom />} />
    </Routes>
  );
}

export default App;