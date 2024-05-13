import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Components/Navbar';
import TesterNavbar from './Components/TesterNavbar';
import { useNavigate } from 'react-router-dom';
import './AppDetails.css';  // Assuming you'll have some styles here
import PrimaryButton from './Components/PrimaryButton';
import ConfirmationModal from './Components/ConfirmationModal';
import BigButton from './Components/BigButton';

function AppDetails() {
    const location = useLocation();
    const { app_id, hashValue } = location.state || {};
    const [appDetails, setAppDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [screenshots, setScreenshots] = useState([]);
    const [appIcons, setAppIcons] = useState([]);
    const [sampleVideos, setSampleVideos] = useState([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); // State for the edit modal
    const role = localStorage.getItem('role');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppDetails = async () => {
            if (!app_id) return;
            try {
                const response = await axios.get(`http://localhost:4000/app/${app_id}`);
                setAppDetails(response.data);
                setLoading(false);

                const screenshotsResponse = await axios.get(`http://localhost:4000/app/${app_id}/screenshots`);
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

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:4000/applist/deleteApp?app_id=${app_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Apk details deleted successfully:', data);
                setIsConfirmModalOpen(false);
                navigate('../Myapps');
            } else {
                console.error('Error deleting apk details:', data);
            }
        } catch (error) {
            console.error('Error deleting apk details:', error);
        }
    };

    const handleEdit = () => {
        setIsEditMode(true);
    }

    const handleUpdate = async () => {
        try {
            const { app_id, ...updatedDetails } = appDetails;
            const response = await fetch(`http://localhost:4000/uploadapp/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ app_id, ...updatedDetails }),
            });

            if (response.ok) {
                window.alert('App details updated successfully');
                navigate('../Myapps');
            } else {
                console.error('Failed to update app details');
            }
        } catch (error) {
            console.error('Error updating app details:', error);
        }
    };

    const gotoAnalysisPage = () => {
        navigate('../AppAnalysis', { state: { app_id: app_id } });
    }

    const mobsfpdfReport = async (hashValue) => {
        const formData = new FormData();
        formData.append('hash', hashValue);
        try {
            const response = await axios.post("http://localhost:8000/api/v1/download_pdf", formData, {
                headers: {
                    Authorization: `helo@123`,
                    "Content-Type": `multipart/form-data`,
                },
                responseType: 'blob',
            });
            if (response.status !== 200) {
                throw new Error("Failed to generate the pdf report");
            }

            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            a.download = 'report.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error generating pdf report:", error);
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app-details-bg">
            <div>
                {role === 'developer' && <Navbar />}
                {role === 'tester' && <TesterNavbar />}
            </div>
            <div className="app-details-container">
                <ConfirmationModal
                    isOpen={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    onConfirm={handleDelete}
                />
                <h1 className="app-nametext">{appDetails.appname}</h1>
                {role === "developer" &&
                    <div id="buttoncontaner">
                        <div id="deleteappbutton" onClick={() => setIsConfirmModalOpen(true)}>
                            <PrimaryButton buttonText="Delete" />
                        </div>
                        <div id="editappbutton" onClick={() => handleEdit()}>
                            <PrimaryButton buttonText="Edit" />
                        </div>
                    </div>
                }
                {role === "tester" &&
                    <div id="buttoncontaner">
                        <div id="analysisbtn" onClick={() => gotoAnalysisPage()} >
                            <PrimaryButton buttonText="Analysis" />
                        </div>
                        <div id="bigbtn" onClick={() => mobsfpdfReport(hashValue)} >
                            <BigButton buttonText="Download Report" />
                        </div>
                    </div>
                }
                <div className="app-info">
                    {/* Render app details here */}
                    <div className='eachDetail'>

                        <span className="info-label">App Name:</span>
                        {isEditMode ? (
                            <input
                                type="text"
                                value={appDetails.appname}
                                onChange={(e) => setAppDetails({ ...appDetails, appname: e.target.value })}
                            />
                        ) : (
                            <span>{appDetails.appname}</span>
                        )}
                    </div>
                    <div className='eachDetail'>
                        <span className="info-label">Category:</span>
                        {isEditMode ? (
                            <select id="categorySelect"
                                value={appDetails.category_id}
                                onChange={(e) => setAppDetails({ ...appDetails, category_id: e.target.value })}
                            >
                                <option value="">Select</option>
                                <option value="Music">Music</option>
                                <option value="Movie">Movie</option>
                                <option value="Sports">Sports</option>
                                <option value="News">News</option>
                            </select>
                        ) : (
                            <span>{appDetails.category_id}</span>
                        )}
                    </div>

                    <div className='eachDetail'>
                        <span className="info-label">Age Rating:</span>
                        {isEditMode ? (
                            <select id="categorySelect"
                                value={appDetails.age_rating_id}
                                onChange={(e) => setAppDetails({ ...appDetails, age_rating_id: e.target.value })}
                            >
                                <option value="">Select</option>
                                <option value="5+">5+</option>
                                <option value="9+">9+</option>
                                <option value="16+">16+</option>
                                <option value="18+">18+</option>
                            </select>
                        ) : (
                            <span>{appDetails.age_rating_id}</span>
                        )}
                    </div>


                    <div className='eachDetail'>
                        <span className="info-label">Short Description:</span>
                        {isEditMode ? (
                            <textarea style={{
                                width: '300px', height: '100px', border: '1px solid #ccc',
                                borderRadius: '3px',
                            }}
                                type="text"
                                value={appDetails.short_description}
                                onChange={(e) => setAppDetails({ ...appDetails, short_description: e.target.value })}
                            />
                        ) : (
                            <span>{appDetails.short_description}</span>
                        )}
                    </div>
                    <div className='eachDetail'>
                        <span className="info-label">Long Description:</span>
                        {isEditMode ? (
                            <textarea style={{
                                width: '300px', height: '150px', border: '1px solid #ccc',
                                borderRadius: '3px',
                            }}
                                type="text"
                                value={appDetails.long_description}
                                onChange={(e) => setAppDetails({ ...appDetails, long_description: e.target.value })}
                            />
                        ) : (
                            <span>{appDetails.long_description}</span>
                        )}
                    </div>
                    <div className='eachDetail'>
                        <span className="info-label">Support URL:</span>
                        {isEditMode ? (
                            <input
                                type="text"
                                value={appDetails.support_url}
                                onChange={(e) => setAppDetails({ ...appDetails, support_url: e.target.value })}
                            />
                        ) : (
                            <a href={appDetails.support_url} target="_blank" rel="noopener noreferrer">{appDetails.support_url}</a>
                        )}
                    </div>
                    <div className='eachDetail'>
                        <span className="info-label">Website URL:</span>
                        {isEditMode ? (
                            <input
                                type="text"
                                value={appDetails.website_url}
                                onChange={(e) => setAppDetails({ ...appDetails, website_url: e.target.value })}
                            />
                        ) : (
                            <a href={appDetails.website_url} target="_blank" rel="noopener noreferrer">{appDetails.website_url}</a>
                        )}

                    </div>
                    <br />


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
                        <br></br>
                        <div className='eachDetail'>
                            <span className="info-label">Status:</span>
                            <span>{appDetails.status}</span>
                        </div>
                    </div>
                </div>
                {isEditMode && (
                    <div className='updatebutton' onClick={handleUpdate}>
                        <PrimaryButton
                            buttonText="Update"
                        />
                    </div>
                )}



            </div>
        </div>

    );
}

export default AppDetails;
