import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import myappsimg from '../icons/apps.png';
import analyticsimg from '../icons/analytics.png';
import profileimg from '../icons/profile.png';
import settingimg from '../icons/settings.png';
import logoutimg from '../icons/Logout.png';
import allgoimage from '../images/Allgoblack.png';
import './Navbar.css';

function TesterNavbar() {


    useEffect(() => {
        if (!localStorage.getItem('token')) {
            window.location.href = '/';
        }
    }, []);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleMyapps = () => {
        navigate('../Myapps');
    };
    const handleProfile = () => {
        navigate('../Profile');
    };

    return (
        <div> 
            <div id="navbar">
                {/* Sidebar content */}
            </div>
            <div id="nav-container">
                <nav>
                <img className="navallgoimg" src={allgoimage} alt='' />
                <ul class="flex flex-col ml-5">
                        <li class="nav-item flex items-center mb-4">
                            <img src={myappsimg} alt="" class="w-5 h-5 ml-1 mr-2" />
                            <span onClick={handleMyapps} class="nav-link cursor-pointer">My Apps</span>
                        </li>
                     
                        <li class="nav-item flex items-center mb-4">
                            <img src={profileimg} alt="" class="w-5 h-5 ml-1 mr-2" />
                            <span onClick={handleProfile} class="nav-link cursor-pointer">Profile</span>
                        </li>
                        <li class="nav-item flex items-center mb-4">
                            <img src={settingimg} alt="" class="w-5 h-5 ml-1 mr-2" />
                            <span class="nav-link cursor-pointer">Settings</span>
                        </li>
                        <li class="nav-item flex items-center mb-4">
                            <img src={logoutimg} alt="" class="w-5 h-5 ml-1 mr-2" />
                            <span onClick={handleLogout} class="nav-link cursor-pointer">Logout</span>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default TesterNavbar;
