import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './AppAnalysis.css'
import TesterNavbar from './Components/TesterNavbar';

const AppAnalysisDetails = () => {

    const location = useLocation();
    const [analysisDetails, setAnalysisDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { app_id } = location.state || {};;
    // let analysisData = ""

    useEffect(() => {
        // Fetch analysis details from backend API
        const fetchAnalysisDetails = async () => {
            try {
                const response = await axios.get('http://localhost:4000/save/retrievejson', {
                    params: {
                        app_id: app_id
                    }
                });
                setAnalysisDetails(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching analysis details:', error); // Log error
                setError(error.message);
                setLoading(false);
            }
        };

        fetchAnalysisDetails();
    }, [app_id]); // Include app_id in dependency array to trigger useEffect when app_id change

    if (!analysisDetails) {
        console.log('Analysis details is null');
    }



    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!analysisDetails) {
        return <div>No analysis details found</div>;
    }

    return (
        <div>
            <div>
                <TesterNavbar />
            </div>
            <div id="analysis-container">
                <h1 className="header">APK Analysis Details</h1>

                <ul className='lists'>
                    <li className="list-item"><strong>Filename: </strong>{analysisDetails.specificDetails.appname}</li>
                    <li className="list-item"><strong>Version:</strong> {analysisDetails.specificDetails.version}</li>
                    <li className="list-item"><strong>App Type:</strong> {analysisDetails.specificDetails.apptype}</li>
                    <li className="list-item"><strong>Size:</strong> {analysisDetails.specificDetails.size}</li>
                    <li className="list-item"><strong>md5: </strong>{analysisDetails.specificDetails.md5}</li>
                    <li className="list-item"><strong>sha1: </strong>{analysisDetails.specificDetails.sha1}</li>
                    <li className="list-item"><strong>sha256:</strong> {analysisDetails.specificDetails.sha256}</li>
                    <li className="list-item"><strong>Package name:</strong> {analysisDetails.specificDetails.packagename}</li>



                    {/* Add more analysis details here */}
                </ul>
            </div>
        </div>
    );
};

export default AppAnalysisDetails;
