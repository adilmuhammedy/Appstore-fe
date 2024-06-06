// App.js
import React, { useEffect } from 'react';
import '../Css/App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import LoginPage from './Login';
import { FormDataProvider } from './FormDataContext';
import Myapps from './Myapps';
import Register from './Register';
import Upload from './Upload';
import Preview from './Preview';
import AppDetails from './AppDetails';
import Profile from './Profile';
import AppAnalysisDetails from './AppAnalysis';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import { Toaster } from "react-hot-toast";

function App() {
  useEffect(() => {
    document.title = 'Allgo';
  }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#575757",
            color: "#FFFFFF",
          },
          duration: 3500,
        }}
      />
      <Routes>
        <Route exact path="/" element={<PublicRoute element={<LoginPage />} />} />
        <Route path="/Register" element={<PublicRoute element={<Register />} />} />
        {/* Use PrivateRoute for protected routes */}
        <Route path="/Myapps" element={<PrivateRoute element={<Myapps />} />} />
        <Route path="/Profile" element={<PrivateRoute element={<Profile />} />} />
        <Route
          path="/Upload"
          element={
            <FormDataProvider>
              <PrivateRoute element={<Upload />} />
            </FormDataProvider>
          }
        />
        <Route
          path="/Preview"
          element={
            <FormDataProvider>
              <PrivateRoute element={<Preview />} />
            </FormDataProvider>
          }
        />
        <Route path="/AppDetails" element={<PrivateRoute element={<AppDetails />} />} />
        <Route path="/AppAnalysis" element={<PrivateRoute element={<AppAnalysisDetails />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
