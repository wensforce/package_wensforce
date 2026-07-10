"use client";
import api from "@/app/axios/axios";
import BookingPageContent from "@/app/components/BookingPageContent";
import { useParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

export const BookingPage = () => {
  const { id } = useParams();
  const [packageData, setPackageData] = useState({});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/package/${id}`);

        setPackageData(res?.data?.data || null);
      } catch (err) {
        console.error("Failed to fetch package", id, err);
        return null;
      }
    };

    fetchDetails();
  }, []);

  return (
    <Suspense fallback={null}>
      <BookingPageContent packageData={packageData} />
    </Suspense>
  );
};

export default BookingPage;
