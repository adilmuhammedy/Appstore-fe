import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import '../Css/AppAnalysis.css'
import TesterNavbar from '../Components/TesterNavbar';
import PrimaryButton from '../Components/PrimaryButton';
import FoursquareLoading from '../Components/FoursquareLoading';
const AppAnalysisDetails = () => {

    const location = useLocation();
    const [analysisDetails, setAnalysisDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { app_id } = location.state || {};;

    // let analysisData = ""
    const navigate = useNavigate();
    const goback = () => {
        navigate(-1);
    }
    useEffect(() => {
        // Fetch analysis details from backend API
        const fetchAnalysisDetails = async () => {
            try {
                const response = await axios.get('http://localhost:4000/mobsf/getjsonreport', {
                    params: {
                        app_id: app_id
                    }
                });
                const jsonUrl = response.data.url;
                const jsonDataResponse = await axios.get(jsonUrl); // Fetch JSON data from the URL
                console.log(jsonDataResponse.data)
                setAnalysisDetails(jsonDataResponse.data); // Set the analysis details state with the JSON data
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
        return <div><FoursquareLoading /></div>;
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
                <h1 className="header"><strong>Static Analysis </strong></h1>
                <div className='goback-button' onClick={() => goback()}>
                    <PrimaryButton buttonText="Go Back" />
                </div>
                <div className='appinfo-container3'>
                    <div className='app-filedetails'>
                        <p className='fileinfo-text'><strong>VULNERABILITIES</strong></p>
                       
                        <div className='scorecard-container'>
                            <div className='scorecard-high'>
                                <p className='scorevalue'>{analysisDetails.appsec.high.length}</p>
                                <h1>HIGH</h1>
                            </div>
                            <div className='scorecard-hotspot'>
                                <p className='scorevalue'> {analysisDetails.appsec.hotspot.length}</p>
                                <h1>HOTSPOT</h1>
                            </div>
                            <div className='scorecard-warning'>
                                <p className='scorevalue'> {analysisDetails.appsec.warning.length}</p>
                                <h1>WARNING</h1>
                            </div>
                            <div className='scorecard-securityscore'>
                                <p className='scorevalue'> {analysisDetails.appsec.secure.length}</p>
                                <h1>SECURE</h1>
                            </div>
                            <div className='scorecard-info'>
                                <p className='scorevalue'> {analysisDetails.appsec.info.length}</p>
                                <h1>INFO</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='appinfo-container'>
                    <div className='app-filedetails'>
                        <p className='fileinfo-text'><strong>FILE INFORMATION</strong></p>
                        <ul className='lists'>
                            <li className="list-item">Filename: {analysisDetails.file_name}</li>
                            <li className="list-item">Size: {analysisDetails.size}</li>
                            <li className="list-item">md5: {analysisDetails.md5}</li>
                            <li className="list-item">sha1: {analysisDetails.sha1}</li>
                            <li className="list-item">sha256: {analysisDetails.sha256}</li>
                        </ul>
                    </div>
                </div>
                <div className='appinfo-container2'>
                    <div className='app-filedetails'>
                        <p className='fileinfo-text'><strong>APP INFORMATION</strong></p>
                        <ul className='lists'>
                            <li className="list-item">App name: {analysisDetails.app_name}</li>
                            <li className="list-item">Package name: {analysisDetails.package_name}</li>
                            <li className="list-item">Main Activity: {analysisDetails.main_activity}</li>
                            <li className="list-item">Target SDK:  {analysisDetails.target_sdk}</li>
                            <li className="list-item">Min SDK: {analysisDetails.min_sdk}</li>
                            <li className="list-item">Max SDK: {analysisDetails.max_sdk}</li>
                            <li className="list-item">Version name: {analysisDetails.version_name}</li>
                        </ul>
                    </div>
                </div>
                
                <div className='appinfo-container4'>
                    <div className='app-filedetails'>
                        <p className='fileinfo-text'><strong>CERTIFICATE INFORMATION</strong></p>
                        <div className='scorecard-container'>
                            <div className='scorecard-high'>
                                <p className='scorevalue'>{analysisDetails.certificate_analysis.certificate_summary.high}</p>
                                <h1>HIGH</h1>
                            </div>
                            <div className='scorecard-info'>
                                <p className='scorevalue'> {analysisDetails.certificate_analysis.certificate_summary.info}</p>
                                <h1>INFO</h1>
                            </div>
                            <div className='scorecard-warning'>
                                <p className='scorevalue'> {analysisDetails.certificate_analysis.certificate_summary.warning}</p>
                                <h1>WARNING</h1>
                            </div>
                        </div>
                        <h1>CERTIFICATE INFO: </h1>
                        {analysisDetails.certificate_analysis.certificate_info.split(/\n/).map((line, index) => (
                            <p key={index} className='scorevalue'>{line}</p>
                        ))}
                    </div>
                </div>
                <div className='appinfo-container5'>
                    <div className='app-filedetails'>
                        <p className='fileinfo-text'><strong>ABUSED PERMISSIONS</strong></p>
                        <div className='scorecard-container'>
                            <div className='scorecard'>
                                <p className='scorevalue'>{analysisDetails.malware_permissions.top_malware_permissions.length}</p>
                                <h1>TOP MALWARE PERMISSIONS</h1>
                            </div>
                            <div className='scorecard'>
                                <p className='scorevalue'> {analysisDetails.malware_permissions.total_malware_permissions}</p>
                                <h1>TOTAL MALWARE PERMISSIONS</h1>
                            </div>
                            <div className='scorecard'>
                                <p className='scorevalue'> {analysisDetails.malware_permissions.total_other_permissions}</p>
                                <h1>OTHER PERMISSIONS</h1>
                            </div>
                        </div>
                        <p><strong>Malware Permissions </strong>are the top permissions that are widely abused by known malware.</p>
                        <p><strong>Other Common Permissions</strong> are permissions that are commonly abused by known malware.</p>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default AppAnalysisDetails;
