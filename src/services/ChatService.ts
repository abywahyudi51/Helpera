import { db } from '../lib/firebase';
import { doc, updateDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';

// Definisi Tipe Data (Model)
export interface ChatItem {
  id: string;
  serviceName: string;
  image: string;
  status: string;
  lastMessage: string;
  userId: string;
  mitraId?: string;
  isChatVisible: boolean; // Field kunci
  updatedAt: any;
  createdAt: any;
}

export const ChatService = {
  // 1. Fungsi untuk Menyembunyikan Chat (Soft Delete)
  // Kita namakan 'hideChat' agar jelas bahwa ini BUKAN menghapus data permanen
  hideChat: async (chatId: string) => {
    const chatRef = doc(db, "bookings", chatId);
    // Kita hanya ubah visibility, TIDAK MENGHAPUS DOKUMEN
    await updateDoc(chatRef, {
      isChatVisible: false
    });
  },

  // 2. Fungsi untuk Memunculkan Chat Kembali
  showChat: async (chatId: string) => {
    const chatRef = doc(db, "bookings", chatId);
    await updateDoc(chatRef, {
      isChatVisible: true
    });
  }
};