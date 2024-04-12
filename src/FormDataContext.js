// FormDataContext.js
import React, { createContext, useContext, useState } from 'react';

const FormDataContext = createContext();

export const useFormData = () => useContext(FormDataContext);

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    apkName: '',
    ageRating: '',
    appCategory:'',
    tags: '',
    appshortDescription:'',
    appLongDescription:'',
    supportUrl:'',
    websiteUrl:'',
    screenshotfile: [],
    appVideo: null,
    appiconfile: [],
    apkFile: null,
  });

  const updateFormData = (newFormData) => {
    setFormData({ ...formData, ...newFormData });
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};
