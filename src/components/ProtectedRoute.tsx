import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function ProtectedRoute() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek status login ke Firebase
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  // Jika user tidak ada (belum login) -> Tendang ke /login
  return user ? <Outlet /> : <Navigate to="/login" />;
}