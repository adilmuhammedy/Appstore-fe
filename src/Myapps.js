import React, { useState, useEffect } from 'react';
import './Myapps.css';
import axios from 'axios'; 
import Navbar from './Components/Navbar';


function Myapps() {
    const [apps, setApps] = useState([]);
    const fetchApps = async () => {
        try {
            const response = await axios.get('http://localhost:4000/applist');
            setApps(response.data.apps);
        } catch (error) {
            console.error('Error fetching apps:', error);
        }
    };
    useEffect(() => {
        fetchApps();
    }, []);
    return (
        <div className="myapps-bg">
            <Navbar />
            <div className="app-container">
                <div className="row-container">
                    {apps.map((appName, index) => (
                        <div className="app-item" key={index}>
                            <h3 className="app-name">{appName}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Myapps;
