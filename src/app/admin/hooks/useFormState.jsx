import { useCallback, useState, useRef, useEffect } from "react";

/**
 * Standardized form state hook.
 * Stores initial state in a ref to keep callback identities stable even if
 * inline object literals are passed as arguments.
 */
export function useFormState(initialState) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const initialRef = useRef(initialState);

  // Keep initialRef updated if a new initial value is supplied
  useEffect(() => {
    initialRef.current = initialState;
  }, [initialState]);

  const handleFieldChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const setFieldValue = useCallback((name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setForm(initialRef.current);
    setErrors({});
  }, []);

  return {
    form,
    setForm,
    errors,
    setErrors,
    handleFieldChange,
    setFieldValue,
    resetForm,
  };
}
