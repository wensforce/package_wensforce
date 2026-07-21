"use client";

import { useState, useEffect, useCallback } from "react";

export function useImagePreview(initialPreviewUrl = null) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialPreviewUrl);

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const newUrl = URL.createObjectURL(selectedFile);

    setPreviewUrl((prev) => {
      // Only revoke if the previous URL was a local object URL
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return newUrl;
    });
  }, []);

  const removeImage = useCallback((fileInputRef = null) => {
    setPreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
    setFile(null);

    if (fileInputRef && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    file,
    setFile,
    previewUrl,
    setPreviewUrl,
    handleFileChange,
    removeImage,
  };
}
