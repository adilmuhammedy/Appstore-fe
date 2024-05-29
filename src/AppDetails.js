import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Components/Navbar';
import TesterNavbar from './Components/TesterNavbar';
import { useNavigate } from 'react-router-dom';
import './AppDetails.css'; // Assuming you'll have some styles here
import PrimaryButton from './Components/PrimaryButton';
import SecondaryButton from './Components/SecondaryButton';
import ConfirmationModal from './Components/ConfirmationModal';
import BigButton from './Components/BigButton';
import Loading from './Components/FoursquareLoading';
import { SnackbarProvider, useSnackbar } from 'notistack'
import BackgroundAnimation from "./Components/BackgroundAnimation";
function AppDetails() {
    const location = useLocation();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [appDetails, setAppDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [dltloading, setdltLoading] = useState(false);
    const [videoFile, setVideoFiles] = useState([]);
    const [screenshotFile, setScreenshotFiles] = useState([]);
    const [appiconFile, setAppiconFiles] = useState([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); // State for the edit modal
    const [hashValue, setHashValue] = useState('');
    const [testStatuses, setTestStatuses] = useState({});
    const testCases = [
        "APK Signature",
        "App Permissions",
        "Supported Devices and Screen Sizes",
        "Code Quality",
        "App content",
        "App security",
        "Performance",
        "Accessibility",
        "App store guidelines and policies",
        "App icons and screenshots"
    ];
    const role = localStorage.getItem('role');
    const navigate = useNavigate();
    const { app_id } = location.state || {};
    const extractValues = (item) => {
        const result = {};
        for (const key in item) {
            if (item[key].S) {
                result[key] = item[key].S;
            } else if (item[key].N) {
                result[key] = item[key].N;
            } else if (item[key].BOOL) {
                result[key] = item[key].BOOL;
            } // Add other DynamoDB types if needed
        }
        return result;
    };
    useEffect(() => {
        const fetchAppDetails = async () => {
            if (!app_id) return;
            try {
                const response = await axios.get(`http://localhost:4000/app/${app_id}`);
                const extractedData = extractValues(response.data);
                setAppDetails(extractedData);
                setLoading(false);

                const screenshotResponse = await axios.get(`http://localhost:4000/app/screenshots/${app_id}`);
                setScreenshotFiles(screenshotResponse.data);

                const appIconsResponse = await axios.get(`http://localhost:4000/app/icons/${app_id}`);
                setAppiconFiles(appIconsResponse.data);

                const sampleVideosResponse = await axios.get(`http://localhost:4000/app/videos/${app_id}`);
                setVideoFiles(sampleVideosResponse.data);

                const hashvalue = await fetchHashValue(app_id);

                // Fetch hash value after app details are fetched
            } catch (error) {
                console.error('Error fetching app details:', error);
                setLoading(true);
            }
        };
        fetchAppDetails();
    }, [app_id]); // Dependency on app_id
    const fetchHashValue = async (app_id) => {
        try {
            const response = await axios.get('http://localhost:4000/mobsf/retrievehashvalue', {
                params: {
                    app_id: app_id
                }
            });
            if (response.status === 200) {
                const hashValue = response.data; // Extract hash value from response data
                setHashValue(hashValue); // Update hashValue state
            }
        } catch (error) {
            console.error('Error retrieving hash value:', error);
        }
    };
    const handleUpdateTestcase = async (app_id, testCase, status) => {
        try {
            // Send POST request to backend endpoint
            const response = await fetch('http://localhost:4000/validation/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ app_id, testCase, status })
            });
            if (response.status === 200) {
                
            } else {
                console.error('Failed to update test case status');
            }
        } catch (error) {
            console.error('Error updating test case status:', error);
        }
    };
    useEffect(() => {
        const fetchTestStatuses = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/validation/${app_id}`);
                if (response.status === 200) {
                    setTestStatuses(response.data);
                }
            } catch (error) {
                console.error('Error fetching test case statuses:', error);
            }
        };
        fetchTestStatuses();
    }, [app_id]);

    const updateAppStatus = async (newStatus) => {
        try {
            const response = await axios.post(`http://localhost:4000/app/updatestatus/${app_id}`, {
                status: newStatus
            });
            if (response.status === 200) {
                setAppDetails(prevDetails => ({
                    ...prevDetails,
                    status: newStatus
                }));
            } else {
                console.error('Failed to update app status');
            }
        } catch (error) {
            console.error('Error updating app status:', error);
        }
    };

    const handleDelete = async () => {
        try {
            setdltLoading(true);
            const response = await fetch(`http://localhost:4000/app/delete/${app_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                enqueueSnackbar("App deleted Successfully",{
                    variant:'success'
                  });
                setdltLoading(false);
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
    };
    const handleUpdate = async () => {
        try {
            const { app_id, ...updatedDetails } = appDetails;
            const response = await fetch(`http://localhost:4000/app/update/${app_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...updatedDetails }),
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
    };

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
    };
    if (loading) {
        return <div><Loading /></div>;
    }
    return (
        <div>
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
                    {/* {loading && <Loading/>} */}
                    {dltloading && <Loading />}
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

                        <div className='eachDetail'>

                            <span className="info-label">App Name</span><br></br>
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
                            <span className="info-label">Category</span><br></br>
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
                            <span className="info-label">Age Rating</span><br></br>
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
                            <span className="info-label">Short Description</span><br></br>
                            {isEditMode ? (
                                <textarea style={{
                               
                                }}
                                className='shortdesc-input'
                                    type="text"
                                    value={appDetails.short_description}
                                    onChange={(e) => setAppDetails({ ...appDetails, short_description: e.target.value })}
                                />
                            ) : (
                                <span>{appDetails.short_description}</span>
                            )}
                        </div>
                        <div className='rhs'>
                            <div className='eachDetail'>
                                <span className="longdesc-span">Long Description</span><br></br>
                                {isEditMode ? (
                                    <textarea 
                                    className='longdesc-input'
                                        type="text"
                                        value={appDetails.long_description}
                                        onChange={(e) => setAppDetails({ ...appDetails, long_description: e.target.value })}
                                    />
                                ) : (
                                    <span>{appDetails.long_description}</span>
                                )}
                            </div>
                            <div className='eachDetail'>
                                <span className="info-label">Support URL:</span><br></br>
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
                                <span className="info-label">Website URL:</span><br></br>
                                {isEditMode ? (
                                    <input className='rightip'
                                        type="text"
                                        value={appDetails.website_url}
                                        onChange={(e) => setAppDetails({ ...appDetails, website_url: e.target.value })}
                                    />
                                ) : (
                                    <a href={appDetails.website_url} target="_blank" rel="noopener noreferrer">{appDetails.website_url}</a>
                                )}

                            </div>
                            <div className='eachDetail'>
                                <span className="info-label">Price:</span><br></br>
                                {isEditMode ? (
                                    <input className='rightip'
                                        type="text"
                                        value={appDetails.price}
                                        onChange={(e) => setAppDetails({ ...appDetails, price: e.target.value })}
                                    />
                                ) : (
                                    <span >{appDetails.price}$</span>
                                )}

                            </div>
                        </div>
                        <br />


                        <div className="media-section">
                            <div className="screenshots">
                                <h3 className="text-xl font-semibold mb-4">Screenshots</h3>
                                <div id="screenshot-list">

                                    {screenshotFile.map((screenshot, index) => (
                                        <img id="screenshot"
                                            key={index}
                                            src={(screenshot.url)} // Use the backend endpoint
                                            alt={`Screenshot ${index}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <br></br>
                            <div id="app-icons">
                                <h3 className="text-xl font-semibold mb-4">App Icons</h3>
                                <div className="app-icon-list">
                                    {appiconFile.map((icon, index) => (
                                        <img key={index} src={(icon.url)} alt={`App Icon ${index}`} />
                                    ))}
                                </div>
                            </div>
                            <br></br>
                            <div id="sample-videos">
                                <h3 className="text-xl font-semibold mb-4">Sample Videos</h3>
                                <div id="video-list">
                                    {videoFile.map((video, index) => (
                                        <video key={index} controls>
                                            <source src={video.url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ))}
                                </div>
                            </div>
                            <br></br>
                            <div className='eachDetail'>
                                <span className="info-label">Status:</span>
                                <span className='statusvalue'>{appDetails.status}</span>
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
                {role === 'tester' &&
                    <div>
                        <div className='validation-container'>
                            <h1 className='heading-validation'>Validations</h1>
                            <div className='testcases'>
                                <p className='status'>Status</p>
                                {testCases.map((testCase, index) => (
                                    <div key={index} className='testcase-item'>
                                        <p>{testCase}</p>
                                        <div className='buttons-container'>
                                            <div
                                                className={`pass-buttons  ${(appDetails.status === "Approved" || appDetails.status === "Rejected" || testStatuses[testCase] === "Passed" || testStatuses[testCase] === "Failed") ? 'disabled' : ''}`}
                                                onClick={() => {
                                                    if (!(testStatuses[testCase] === "Passed" || testStatuses[testCase] === "Failed")) {
                                                        const newTestStatuses = { ...testStatuses, [testCase]: "Passed" };
                                                        setTestStatuses(newTestStatuses);
                                                        handleUpdateTestcase(app_id, testCase, "Passed");
                                                    }
                                                }}
                                            >
                                                <PrimaryButton buttonText="Pass" />
                                            </div>
                                            <div
                                                className={`fail-buttons ${(appDetails.status === "Approved" || appDetails.status === "Rejected" || testStatuses[testCase] === "Passed" || testStatuses[testCase] === "Failed") ? 'disabled' : ''}`}
                                                onClick={() => {
                                                    if (!(testStatuses[testCase] === "Passed" || testStatuses[testCase] === "Failed")) {
                                                        const newTestStatuses = { ...testStatuses, [testCase]: "Failed" };
                                                        setTestStatuses(newTestStatuses);
                                                        handleUpdateTestcase(app_id, testCase, "Failed");
                                                    }
                                                }}
                                            >
                                                <SecondaryButton buttonText="Fail" />
                                            </div>
                                            <div>
                                                <p className='statusresult'>{testStatuses[testCase]}</p>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='finalbtns'>
                            <button className={`approve-button  ${(appDetails.status === "Approved" || appDetails.status === "Rejected") ? 'disabled' : ''}`} onClick={() => updateAppStatus("Approved")} >
                                Approve
                            </button>
                            <ConfirmationModal
                        isOpen={isConfirmModalOpen}
                        onClose={() => setIsConfirmModalOpen(false)}
                        onConfirm={handleDelete}
                    />
                            <button className={`reject-button  ${(appDetails.status === "Approved" || appDetails.status === "Rejected") ? 'disabled' : ''}`} onClick={() => updateAppStatus("Rejected")} >
                                Reject
                            </button>
                        </div>
                    </div>
                }

            </div>

        </div>
    );
}

export default AppDetails;
