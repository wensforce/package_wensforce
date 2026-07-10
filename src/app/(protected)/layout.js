// app/(protected)/layout.js
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/Auth/LoginModal";

export default function ProtectedLayout({ children }) {
  const { isLoggedIn, authLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) setShowModal(true);
  }, [authLoading, isLoggedIn]);

  return (
    <>
      {children}
      {showModal && <LoginModal onSuccess={() => setShowModal(false)} />}
    </>
  );
}
