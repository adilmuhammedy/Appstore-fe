import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import LoginPage from './Login.js'; 
import Home from './Home.js';
import Myapps from './Myapps.js';
import Metadata from './Metadata.js';
import Register from './Register.js';
import Upload from './Upload.js';

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
        <Route path="/Register" element={<Register/>}/>
        <Route path="/Upload" element={<Upload/>}/>
    </Routes>
    </BrowserRouter>
   
  );
}

export default App;
