import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Navbar from './Components/Navbar';
import './Myapps.css';
import submitIcon from './icons/Submit_icon.png'
import PrimaryButton from './Components/PrimaryButton';

function Myapps() {
    const [apps, setApps] = useState([]);

    const navigate = useNavigate();
    const newApp = () => {
        navigate('../Upload');
    }
    const fetchApps = async () => {
        try {
            const response = await axios.get('http://localhost:4000/applist/getApp');
            setApps(response.data.apps);

        } catch (error) {
            console.error('Error fetching apps:', error);
        }
    };

    useEffect(() => { 
        fetchApps();
    }, []);

    const viewAppDetails = (app_id) => {
        // console.log("Clicked app_id:", app_id); 
       navigate(`../AppDetails/`, { state: { app_id: app_id } });
    };
    
    

    return (
        <div className="myapps-bg">
            <div>
            <Navbar />
            </div>
            <div id="newappbtn" onClick={newApp}>
            <PrimaryButton buttonText="New App" />
            </div>
            <div className="app-container">
            <div className="header-section mb-8 m-8">
                    <h1 className="text-3xl font-bold text-gray-800">MyApps</h1>
                    <p className="text-base text-gray-600">Submitted apps will be listed here</p>
                </div>
                <div className="flex flex-wrap justify-right">
                    {apps.map((app, index) => (
                        <div id="applists" className="app-item p-8 border border-gray-300 rounded-lg shadow-md mb-8 cursor-pointer transform transition-transform duration-300 hover:scale-105  ml-auto" key={index} onClick={() => viewAppDetails(app.app_id)}>
                            <h3 className="app-name text-base font-bold">{app.appname}</h3>
                            <p className="app-category">Category: {app.category_id}</p>
                            <p className="app-status">Status: {app.status}</p>
                            {app.status === 'Submitted' ? <img src={submitIcon} id="submit_icon" alt="Submit Icon" /> : null}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default Myapps;