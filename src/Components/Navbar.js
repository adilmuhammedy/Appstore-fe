import React, { useEffect } from 'react';
import homeimg from '../icons/Home.png';
import myappsimg from '../icons/apps.png';
import analyticsimg from '../icons/analytics.png';
import profileimg from '../icons/profile.png';
import settingimg from '../icons/settings.png';
import logoutimg from '../icons/Logout.png';
import './Navbar.css';

function Navbar() {


    useEffect(() => {
        if (!localStorage.getItem('token')) {
            window.location.href = '/';
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const handleMyapps = () => {
        window.location.href = '../Myapps';
    };

    return (
        <div> 
            <div id="navbar">
                {/* Sidebar content */}
            </div>
            <div id="nav-container">
                <nav>
                    <ul className="flex flex-col ml-5">
                        <li className="flex items-center mb-4">
                            <img src={myappsimg} alt='' className="w-5 h-5  mb-5 ml-1 mr-2" />
                            <span onClick={handleMyapps} className="nav-link cursor-pointer">My Apps</span>
                        </li>
                        <li className="flex items-center mb-4">
                            <img src={analyticsimg} alt='' className="w-5 h-5  mb-5 ml-1 mr-2" />
                            <span className="nav-link">Analytics</span>
                        </li>
                        <li className="flex items-center mb-4">
                            <img src={profileimg} alt='' className="w-5 h-5  mb-5 ml-1 " />
                            <span className="nav-link">Profile</span>
                        </li>
                        <li className="flex items-center mb-4">
                            <img src={settingimg} alt='' className="w-5 h-5  mb-5 ml-1 mr-2" />
                            <span className="nav-link cursor-pointer">Settings</span>
                        </li>
                        <li className="flex items-center mb-4">
                            <img src={logoutimg} alt='' className="w-5 h-5  mb-5 ml-1 mr-2" />
                            <span onClick={handleLogout} className="nav-link cursor-pointer">Logout</span>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default Navbar;
