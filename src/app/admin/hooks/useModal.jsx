"use client";

import { useState, useCallback } from "react";

/**
 * A hook to manage modal visibility state and optional modal data.
 *
 * @param {boolean} [initialState=false] - Initial visibility state of the modal
 * @returns {{
 *   isOpen: boolean,
 *   data: any,
 *   open: (modalData?: any) => void,
 *   close: () => void,
 *   toggle: () => void,
 *   setData: (data: any) => void
 * }}
 */
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState(null);

  const open = useCallback((modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
    setData,
  };
}
