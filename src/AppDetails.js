import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Components/Navbar';
import { useNavigate } from 'react-router-dom';
import './AppDetails.css';  // Assuming you'll have some styles here
import PrimaryButton from './Components/PrimaryButton';
import ConfirmationModal from './Components/ConfirmationModal';

function AppDetails() {
    const location = useLocation();
    const { app_id } = location.state;
    const [appDetails, setAppDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [screenshots, setScreenshots] = useState([]);
    const [appIcons, setAppIcons] = useState([]);
    const [sampleVideos, setSampleVideos] = useState([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);


    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
          // Make an API call to delete the apk details
          console.log(`app id=`,app_id);
          const response = await fetch(`http://localhost:4000/applist/deleteApp?app_id=${app_id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          const data = await response.json();
      
          if (response.ok) {
            console.log('Apk details deleted successfully:', data);
            // Close the confirmation modal
            setIsConfirmModalOpen(false);
            navigate('../Myapps');
          } else {
            console.error('Errorrrr deleting apk details:', data);
            // Handle error and display an error message to the user
          }
        } catch (error) {
          console.error('Error deleting apk details:', error);
          // Handle error and display an error message to the user
        }
      };
      

    useEffect(() => {
        console.log("Received app_id:", app_id);  // Log the app_id
        const fetchAppDetails = async () => {
            try {

                const response = await axios.get(`http://localhost:4000/app/${app_id}`);
                setAppDetails(response.data);
                setLoading(false);

                // Fetch filenames of screenshots, app icons, and sample videos
                const screenshotsResponse = await axios.get(`http://localhost:4000/app/${app_id}/screenshots`);
                console.log(`screenshotsResponse`, screenshotsResponse);
                setScreenshots(screenshotsResponse.data);

                const appIconsResponse = await axios.get(`http://localhost:4000/app/${app_id}/appicons`);
                setAppIcons(appIconsResponse.data);

                const sampleVideosResponse = await axios.get(`http://localhost:4000/app/${app_id}/samplevideos`);
                setSampleVideos(sampleVideosResponse.data);
            } catch (error) {
                console.error('Error fetching app details:', error);
                setLoading(false);
            }
        };

        fetchAppDetails();
    }, [app_id]);

    if (loading) {
        return <div>Loading...</div>;  // Placeholder for when app details are being fetched
    }

    return (
        <div className="app-details-bg">
            <div>
                <Navbar />
            </div>

            <div className="app-details-container">
 
                <ConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleDelete}
                />
   
                <div className="app-info">
                <h1 className="app-nametext">{appDetails.appname}</h1>
                    <div id="deleteappbutton" onClick={() => setIsConfirmModalOpen(true)} > 
                    <PrimaryButton buttonText="Delete" />
                    </div>
                    <div className="app-info">
                        <p><span className="info-label">App ID:</span> {appDetails.app_id}</p>
                        <p><span className="info-label">Category:</span> {appDetails.category_id}</p>
                        <p><span className="info-label">Status:</span> {appDetails.status}</p>
                        <p><span className="info-label">Short Description:</span> {appDetails.short_description}</p>
                        <p><span className="info-label">Long Description:</span> {appDetails.long_description}</p>
                        <p><span className="info-label">Support URL:</span> <a href={appDetails.support_url} target="_blank" rel="noopener noreferrer">{appDetails.support_url}</a></p>
                        <p><span className="info-label">Website URL:</span> <a href={appDetails.website_url} target="_blank" rel="noopener noreferrer">{appDetails.website_url}</a></p>
                    </div>
                    <br></br>

                    <div className="media-section">
                        <div className="screenshots">
                            <h3 className="text-xl font-semibold mb-4">Screenshots</h3>
                            <div id="screenshot-list">

                                {screenshots.map((screenshot, index) => (
                                    <img
                                        key={index}
                                        src={`http://localhost:4000/app/uploads/${screenshot}`} // Use the backend endpoint
                                        alt={`Screenshot ${index}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <br></br>
                        <div id="app-icons">
                            <h3 className="text-xl font-semibold mb-4">App Icons</h3>
                            <div className="app-icon-list">
                                {appIcons.map((icon, index) => (
                                    <img key={index} src={`http://localhost:4000/app/uploads/${icon}`} alt={`App Icon ${index}`} />
                                ))}
                            </div>
                        </div>
                        <br></br>
                        <div id="sample-videos">
                            <h3 className="text-xl font-semibold mb-4">Sample Videos</h3>
                            <div id="video-list">
                                {sampleVideos.map((video, index) => (
                                    <video key={index} controls>
                                        <source src={`http://localhost:4000/app/uploads/${video}`} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AppDetails;
