import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import LoginPage from './Login.js'; 
import Myapps from './Myapps.js';
import Register from './Register.js';
import Upload from './Upload.js';
import Preview from './Preview.js';
import AppDetails from './AppDetails.js';


function App() {
  useEffect(() => {
    document.title = 'Allgo'; 
  }, []); 

  return (
    <BrowserRouter>
    <Routes>
        <Route exact path="/" element={<LoginPage/>} />
        {/* <Route path="/Home" element={<Home/>} /> */}
        <Route path="/Myapps" element={<Myapps/>} />
        <Route path="/Register" element={<Register/>}/>
        <Route path="/Upload" element={<Upload/>}/>
        <Route path="/Preview" element={<Preview/>}/>
        <Route path="AppDetails" element={<AppDetails/>}/>
    </Routes>
    </BrowserRouter>
   
  );
}

export default App;
