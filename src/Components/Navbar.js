import React, { useEffect } from 'react'
import './Navbar.css'
import homeimg from '../icons/Home.png'
import myappsimg from '../icons/apps.png'
import analyticsimg from '../icons/analytics.png'
import profileimg from '../icons/profile.png'
import settingimg from '../icons/settings.png'
import logoutimg from '../icons/Logout.png'

function Navbar(){
    const handleHome = () => {
        // Handle login logic here
        window.location.href = '../Home';
    };
    const handleSettings = () => {
        window.location.href='../Metadata'
    }
// Assuming you're using JavaScript on the frontend, such as in a React component

useEffect(()=>{
    if(!localStorage.getItem('token')){
        window.location.href = '/'
    }
},[])

const handleLogout=()=> {
    localStorage.removeItem('token');
    window.location.href='/';

};


    
    const handleMyapps=()=>{
        window.location.href = '../Myapps';
    }
    return(
    <div>
    <div id="navbar">   </div>
    <div id="nav-container">
         <nav >
             <ul>
                 <img id="homeimg" src={homeimg} alt='' />
                 <li id="home" onClick={handleHome} class="nav-link">Home</li>
                 <img id="myappsimg" src={myappsimg} alt='' />
                 <li id="myapps" onClick={handleMyapps} class="nav-link">My Apps</li>
                 <img id="analyticsimg" src={analyticsimg} alt='' />
                 <li id="analytics" class="nav-link">Analytics</li>
                 <img id="profileimg" src={profileimg} alt='' />
                 <li id="profile" class="nav-link">Profile</li>
                 <img id="settingimg" src={settingimg} alt='' />
                 <li id="settings" onClick={handleSettings} class="nav-link">Settings</li>
                 <img id="logoutimg" src={logoutimg} alt='' />
                 <li id="logout" onClick={handleLogout} class="nav-link">Logout</li>
             </ul>
         </nav>
         </div>
         </div>
    );
}

export default Navbar;