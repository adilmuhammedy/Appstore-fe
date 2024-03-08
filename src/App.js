import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import LoginPage from './Login.js'; 
import Home from './Home.js';
import Myapps from './Myapps.js'
import Metadata from './Metadata.js'

function App() {
  useEffect(() => {
    document.title = 'Allgo'; 
  }, []); 

  return (
    <BrowserRouter>
    <Routes>
        <Route exact path="/" element={<LoginPage/>} />
        <Route path="/Home" element={<Home/>} />
        <Route path="/Myapps" element={<Myapps/>} />
        <Route path="/Metadata" element={<Metadata/>} />
    </Routes>
    </BrowserRouter>
   
  );
}

export default App;
