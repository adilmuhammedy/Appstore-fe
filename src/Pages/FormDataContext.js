// FormDataContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';
export const FormDataContext = createContext();
export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({});

  const updateFormData = useCallback((data) => {
    setFormData((prevData) => ({
      ...prevData,
      ...data,
    }));
  }, []);

  return (
    <FormDataContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};

export const useFormData = () => {
  return useContext(FormDataContext);
};
