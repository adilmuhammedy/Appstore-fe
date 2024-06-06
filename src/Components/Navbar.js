import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import myappsimg from '../icons/apps.png';
import analyticsimg from '../icons/analytics.png';
import profileimg from '../icons/profile.png';
import settingimg from '../icons/settings.png';
import logoutimg from '../icons/Logout.png';
import allgoimage from '../images/Allgoblack.png';
import './Navbar.css';

function Navbar() {
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
                    <ul className="flex flex-col ml-5">
                        <li className="nav-item flex items-center mb-4">
                            <img src={myappsimg} alt="" className="w-5 h-5 ml-1 mr-2" />
                            <span onClick={handleMyapps} className="nav-link cursor-pointer">My Apps</span>
                        </li>
                        {/* <li className="nav-item flex items-center mb-4">
                            <img src={analyticsimg} alt="" className="w-5 h-5 ml-1 mr-2" />
                            <a href="http://10.118.194.101:5173/" className="nav-link cursor-pointer">Analytics</a>
                        </li> */}
                        <li className="nav-item flex items-center mb-4">
                            <img src={profileimg} alt="" className="w-5 h-5 ml-1 mr-2" />
                            <span onClick={handleProfile} className="nav-link cursor-pointer">Profile</span>
                        </li>
                        <li className="nav-item flex items-center mb-4">
                            <img src={logoutimg} alt="" className="w-5 h-5 ml-1 mr-2" />
                            <span onClick={handleLogout} className="nav-link cursor-pointer">Logout</span>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default Navbar;
