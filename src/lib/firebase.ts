// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAQZITOq8tDro_PIUvIeQAzi2NHNmDEoUo",
  authDomain: "helpera-66b69.firebaseapp.com",
  projectId: "helpera-66b69",
  storageBucket: "helpera-66b69.firebasestorage.app",
  messagingSenderId: "841226659990",
  appId: "1:841226659990:web:92abea5b6e489e24757ab7"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);