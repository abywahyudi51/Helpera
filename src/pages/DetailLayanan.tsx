import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Star, ShieldCheck, CheckCircle2, X, Wallet, CreditCard } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, getDocs } from 'firebase/firestore'; 
import toast from 'react-hot-toast';

const DetailLayanan: React.FC = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState('Tunai');

  const SERVICE_CATALOG: any = {
    'clean-kitchen': { title: 'Cleaning Dapur Total', price: 75000, rating: 4.8, image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80', desc: 'Membersihkan area dapur.', features: ['Durasi Maks 2 Jam', 'Cairan Pembersih', 'Membersihkan Wastafel'] },
    'clean-bathroom': { title: 'Cleaning Kamar Mandi', price: 50000, rating: 4.9, image: 'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?w=800&q=80', desc: 'Sikat kerak lantai & kloset.', features: ['Sikat Lantai', 'Pembersih Kloset', 'Pengharum'] },
    'service-ac': { title: 'Cuci AC Split', price: 75000, rating: 4.9, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80', desc: 'Cuci unit indoor & outdoor.', features: ['Cuci Indoor & Outdoor', 'Cek Freon', 'Garansi 7 Hari'] },
    'oil-change': { title: 'Ganti Oli Motor', price: 35000, rating: 4.7, image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&q=80', desc: 'Jasa mekanik panggilan.', features: ['Mekanik Pro', 'Cek Rem', 'Request Oli'] },
    'massage': { title: 'Pijat Refleksi', price: 90000, rating: 4.9, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', desc: 'Pijat refleksi seluruh badan.', features: ['Durasi 90 Menit', 'Aromaterapi', 'Terapis Pro'] },
  };

  const service = SERVICE_CATALOG[id || ''] || SERVICE_CATALOG['service-ac'];

  useEffect(() => {
    const fetchPaymentMethods = async () => {
        const user = auth.currentUser;
        if(user) {
            const q = query(collection(db, "users", user.uid, "paymentMethods"));
            const snapshot = await getDocs(q);
            const methods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPaymentMethods(methods);
        }
    };
    if (showConfirmModal) {
        fetchPaymentMethods();
    }
  }, [showConfirmModal]);

  const onOrderClick = () => {
    const user = auth.currentUser;
    if (!user) {
        toast.error("Silakan login dulu 🔒");
        navigate('/login');
        return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirmOrder = async () => {
    setLoading(true);
    const user = auth.currentUser;

    const autoChatMessages = [
        "Ok, saya segera ke lokasi! 🚀",
        "Terima kasih karena memesan jasa kami 🙏😊",
        "Halo kak! Pesanan diterima, mohon ditunggu ya, saya sedang bersiap. 🛠️",
        "Siap kak! Saya akan segera berangkat. Pastikan alamat sudah sesuai ya. 🛵",
        "Terima kasih kak! Senang bisa membantu. Saya akan tiba dalam estimasi waktu. ⏳",
        "Hai! Pesanan masuk. Saya on the way, jangan lupa siapkan kopi ya 😄☕",
        "Siap laksanakan! Otw ke TKP. Mohon HP tetap aktif ya kak agar mudah dihubungi. 📱",
        "Pesanan dikonfirmasi! Terima kasih sudah mempercayakan pada kami. See you! 👋",
        "Gas! Saya segera berangkat. Tunggu kedatangan saya ya kak. 🏍️💨",
        "Halo! Terima kasih rezekinya hari ini kak. Saya akan berikan pelayanan terbaik! 🌟",
        "Selamat pagi/siang/sore! Pesanan kakak sudah saya terima. Segera meluncur! 🫡",
        "Oke kak, siap membantu membereskan masalahmu. Tunggu sebentar ya! 💪"
    ];

    const randomMessage = autoChatMessages[Math.floor(Math.random() * autoChatMessages.length)];

    try {
        if(user) {
            // 1. Simpan Pesanan (Booking)
            const bookingRef = await addDoc(collection(db, "bookings"), {
                userId: user.uid,
                serviceId: id || 'custom',
                serviceName: service.title,
                price: service.price,
                image: service.image,
                status: "Baru",
                location: "Rumah (GPS)",
                paymentMethod: selectedPayment,
                createdAt: serverTimestamp(),
                // --- TAMBAHKAN BARIS INI ---
                 isChatVisible: true, // Agar chat langsung muncul di ChatList
                updatedAt: serverTimestamp() // Agar urutannya paling atas
    // ---------------------------
            });

            // 2. Buat Pesan Chat Otomatis
            // PENTING: role 'mitra' agar muncul di sisi kiri pada ChatRoom customer
            await addDoc(collection(db, "bookings", bookingRef.id, "messages"), {
                text: randomMessage,
                senderId: 'mitra-system', 
                role: 'mitra', 
                createdAt: serverTimestamp(),
                isRead: false
            });

            // 3. KIRIM NOTIFIKASI KE USER
            await addDoc(collection(db, "users", user.uid, "notifications"), {
                type: 'chat',
                title: 'Pesan Baru dari Mitra',
                message: randomMessage,
                date: new Date().toLocaleDateString('id-ID'),
                read: false,
                link: `/chat/${bookingRef.id}`,
                createdAt: serverTimestamp()
            });

            setShowConfirmModal(false);
            toast.success("Pesanan Berhasil! Mitra akan segera menghubungi 🔔");
            
            // Opsional: Langsung arahkan ke chat setelah pesan
            navigate(`/chat/${bookingRef.id}`);
        }
    } catch (error: any) {
        console.error("Error booking:", error);
        toast.error("Gagal: " + error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-24 md:pt-6 animate-in slide-in-from-right duration-300 relative">
      
      <div className="absolute top-4 left-4 z-20 md:hidden">
        <button onClick={() => navigate(-1)} className="bg-white/90 p-2 rounded-full shadow-lg backdrop-blur-sm active:scale-90 transition-transform">
            <ArrowLeft size={24} className="text-gray-800"/>
        </button>
      </div>

      <div className="h-72 md:h-96 w-full relative group">
        <img src={service.image} alt={service.title} className="w-full h-full object-cover md:rounded-b-[40px]" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/80 to-transparent md:rounded-b-[40px]"></div>
        <button onClick={() => navigate(-1)} className="hidden md:block absolute top-8 left-8 bg-white/30 hover:bg-white/50 p-3 rounded-full backdrop-blur-md transition-all">
            <ArrowLeft className="text-white" />
        </button>
      </div>

      <div className="px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-extrabold text-gray-900 leading-tight w-2/3">{service.title}</h1>
                <div className="text-right">
                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">Harga</p>
                    <p className="text-xl font-black text-[#0F3D85]">Rp{service.price.toLocaleString('id-ID')}</p>
                </div>
            </div>

            <div className="flex items-center gap-1.5 mb-6">
                <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < Math.floor(service.rating) ? "currentColor" : "none"} className={i < Math.floor(service.rating) ? "" : "text-gray-300"} />
                    ))}
                </div>
                <span className="text-gray-500 text-sm font-medium ml-2">({service.rating} dari 100+ ulasan)</span>
            </div>
            
            <hr className="border-gray-100 mb-6"/>

            <h3 className="font-bold text-gray-900 mb-2">Tentang Layanan</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">{service.desc}</p>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <Clock size={20} className="text-blue-500"/>
                    <div><p className="text-xs text-blue-400 font-bold">Estimasi</p><p className="font-bold text-gray-800 text-sm">60-90 Menit</p></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <MapPin size={20} className="text-orange-500"/>
                    <div><p className="text-xs text-orange-400 font-bold">Lokasi</p><p className="font-bold text-gray-800 text-sm">Di Rumahmu</p></div>
                </div>
            </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 md:relative md:border-none md:shadow-none md:mt-8 md:bg-transparent z-30">
        <div className="max-w-4xl mx-auto flex gap-4">
            <button className="p-4 rounded-2xl border border-gray-200 text-gray-400 hover:bg-gray-50">
                <ShieldCheck size={24} />
            </button>
            <button onClick={onOrderClick} className="flex-1 bg-[#0F3D85] text-white font-bold text-lg py-4 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-800 active:scale-95 transition-all">
                Pesan Sekarang
            </button>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-[30px] p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-blue-50 z-0"></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-4">
                        <div className="bg-white p-3 rounded-2xl shadow-sm">
                            <Wallet className="w-6 h-6 text-[#0F3D85]" />
                        </div>
                        <button onClick={() => setShowConfirmModal(false)} className="p-2 bg-white/50 hover:bg-white rounded-full">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-1">Konfirmasi Pesanan</h3>
                    <p className="text-gray-500 text-sm mb-6">Cek kembali pesananmu.</p>

                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-4 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Layanan</span>
                            <span className="font-bold text-gray-800 text-right w-1/2">{service.title}</span>
                        </div>
                        <div className="h-[1px] bg-gray-200 w-full"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-medium">Total Tagihan</span>
                            <span className="text-[#0F3D85] font-black text-lg">Rp{service.price.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-xs font-bold text-gray-400 uppercase mb-2">Metode Pembayaran</p>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            <button 
                                onClick={() => setSelectedPayment('Tunai')}
                                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${selectedPayment === 'Tunai' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-600'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <Wallet size={18} />
                                    <span className="font-bold text-sm">Tunai (Cash)</span>
                                </div>
                                {selectedPayment === 'Tunai' && <CheckCircle2 size={18} />}
                            </button>

                            {paymentMethods.map((method) => (
                                <button 
                                    key={method.id}
                                    onClick={() => setSelectedPayment(`${method.provider} - ${method.number}`)}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${selectedPayment.includes(method.provider) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <CreditCard size={18} />
                                        <div className="text-left">
                                            <span className="font-bold text-sm block">{method.provider}</span>
                                            <span className="text-[10px] opacity-70">{method.number}</span>
                                        </div>
                                    </div>
                                    {selectedPayment.includes(method.provider) && <CheckCircle2 size={18} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200">
                            Batal
                        </button>
                        <button onClick={handleConfirmOrder} disabled={loading} className="flex-[1.5] py-3 px-4 rounded-xl font-bold text-white bg-[#0F3D85] hover:bg-blue-800 shadow-lg shadow-blue-200">
                            {loading ? "Memproses..." : "Bayar & Pesan"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default DetailLayanan;