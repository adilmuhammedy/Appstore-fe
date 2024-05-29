import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import LoginPage from './Login.js';
import Myapps from './Myapps.js';
import Register from './Register.js';
import Upload from './Upload.js';
import Preview from './Preview.js';
import AppDetails from './AppDetails.js';
import Profile from './Profile.js';
import AppAnalysisDetails from './AppAnalysis.js';
import PrivateRoute from './PrivateRoute';
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { SnackbarProvider, useSnackbar } from 'notistack'

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

        <Route exact path="/" element={<LoginPage />} />
        <Route path="/Register" element={<Register />} />
        {/* Use PrivateRoute for protected routes */}

        <Route path="/Myapps" element={<PrivateRoute element={<Myapps />} />} />
        <Route path="/Upload" element={<PrivateRoute element={<Upload />} />} />
        <Route path="/Profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/Preview" element={<PrivateRoute element={<Preview />} />} />
        <Route path="/AppDetails" element={<PrivateRoute element={<AppDetails />} />} />
        <Route path="/AppAnalysis" element={<PrivateRoute element={<AppAnalysisDetails />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
