import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import Navbar from './Components/Navbar';
import './Myapps.css';

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
                <div className="flex flex-wrap">
                    {apps.map((appName, index) => (
                        <div className="app-item p-4 border border-gray-300 rounded-lg shadow-md m-8 cursor-pointer" key={index}>
                            <h3 className="app-name text-base">{appName}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Myapps;
