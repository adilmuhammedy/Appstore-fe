import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import TesterNavbar from '../Components/TesterNavbar';
import { useNavigate } from 'react-router-dom';
import '../Css/AppDetails.css'; // Assuming you'll have some styles here
import PrimaryButton from '../Components/PrimaryButton';
import SecondaryButton from '../Components/SecondaryButton';
import ConfirmationModal from '../Components/ConfirmationModal';
import BigButton from '../Components/BigButton';
import Loading from '../Components/FoursquareLoading';
import { useSnackbar } from 'notistack';
import EditIcon from '../icons/edit-icon.png';
import DeleteIcon from '../icons/delete-icon.png'
function AppDetails() {
    const location = useLocation();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const fileInputRef = useRef(null);
    const [newScreenshotFile, setnewScreenshotFile] = useState([]);
    const [newAppIcon, setnewAppIcon] = useState();
    const [showAppIconInput, setShowAppIconInput] = useState(false);
    const [newAppVideo, setnewAppVideo] = useState();
    const [showAppVideoInput, setAppVideoInput] = useState(false);
    const [appDetails, setAppDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [dltloading, setdltLoading] = useState(false);
    const [videoFile, setVideoFiles] = useState([]);
    const [screenshotFile, setScreenshotFiles] = useState([]);
    const [appiconFile, setAppiconFiles] = useState([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); // State for the edit modal
    const [hashValue, setHashValue] = useState('');
    const [displayBasicInfo, setBasicInfo] = useState(true);
    const [displayMediaInfo, setMediaInfo] = useState(false);
    const [displayValidationInfo, setValidationInfo] = useState(false);
    const [testStatuses, setTestStatuses] = useState({});
    const [activeTab, setActiveTab] = useState('basic-info');
    const [analysisDetails, setAnalysisDetails] = useState(null);
    const { app_id } = location.state || {};
   
    const testCases = [
        "APK Signature",
        "App Permissions",
        "Vulnerability",
        "Code Quality",
        "App content",
        "App security",
        "Performance",
        "Accessibility",
        "App store guidelines and policies",
        "App icons and screenshots"
    ];
    const handleBasicInfoClick = () => {
        setActiveTab('basic-info');
        setBasicInfo(true);
        setMediaInfo(false);
        setValidationInfo(false);
    };

    const handleMediaClick = () => {
        setActiveTab('media');
        setBasicInfo(false);
        setMediaInfo(true);
        setValidationInfo(false);
        // Additional logic for handling click event
    };

    const handleValidationClick = () => {
        setActiveTab('validation');
        setBasicInfo(false);
        setMediaInfo(false);
        setValidationInfo(true);
        // Additional logic for handling click event
    };
    const handleEditAppIcon = () => {
        setShowAppIconInput(true);
    };
    const handleEditAppVideo = () => {
        setAppVideoInput(true);
    };
    const handleAppVideoFileChange = (event) => {
        const file = event.target.files[0];
        const fileType = file.type.split('/')[0];
        const newFileName = `video_${Date.now()}_${file.name}`;
        const newFile = new File([file], newFileName, { type: file.type });
        setnewAppVideo(newFile);
    };
    const handleAppIconFileChange = (event) => {
        const file = event.target.files[0];
        const fileType = file.type.split('/')[0];
        const newFileName = `appicon_${Date.now()}_${file.name}`;
        const newFile = new File([file], newFileName, { type: file.type });
        setnewAppIcon(newFile);
    };
    const handleScreenshotFileChange = (event) => {
        const selectedFiles = event.target.files;
        const renamedFiles = Array.from(selectedFiles).map((file, index) => {
            const fileType = file.type.split('/')[0]; // Determine the file type (e.g., image, video, application)
            const newFileName = `screenshot${index}${fileType}_${Date.now()}_${file.name}`; // Generate a new name for the file
            return new File([file], newFileName, { type: file.type });
        });
        setnewScreenshotFile(renamedFiles);
    };
    const role = localStorage.getItem('role');
    const navigate = useNavigate();
  
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
    const fetchAppDetails = async () => {
        if (!app_id) return;
        try {
            const response = await axios.get(`http://localhost:4000/app/${app_id}`);
            const extractedData = extractValues(response.data);
            setAppDetails(extractedData);
            setLoading(false);

            const screenshotResponse = await axios.get(`http://localhost:4000/app/getscreenshots/${app_id}`);
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
        // Fetch analysis details from backend API
        const fetchAnalysisDetails = async () => {
            if (!app_id) return;
            try {
                const response = await axios.get('http://localhost:4000/mobsf/getjsonreport', {
                    params: {
                        app_id: app_id
                    }
                });
                const jsonUrl = response.data.url;
                const jsonDataResponse = await axios.get(jsonUrl); // Fetch JSON data from the URL
                console.log(`response from fetching json response`,jsonDataResponse.data);
                setAnalysisDetails(jsonDataResponse.data); // Set the analysis details state with the JSON data
                console.log(`hi`,jsonDataResponse.data.certificate_analysis.certificate_summary.high);
                console.log(`helo`,jsonDataResponse.data.appsec.high.length);
                if(jsonDataResponse.data.certificate_analysis.certificate_summary.high>0){
                    handleUpdateTestcase(app_id,"APK Signature","Failed");
                }
                if(jsonDataResponse.data.appsec.high.length>2){
                    handleUpdateTestcase(app_id,"Vulnerability","Failed");
                }
                // setLoading(false);
            } catch (error) {
                console.error('Error fetching analysis details:', error); // Log error
                // setLoading(false);
            }
        };
    useEffect(() => {
        fetchAppDetails();
    }, [app_id]); // Dependency on app_id
    useEffect(() => {
        fetchAnalysisDetails();
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

    const handleDeleteScreenshot = async (app_id, key) => {
        console.log(app_id);
        try {
            const response = await axios.post(`http://localhost:4000/app/deletescreenshot`, {
                app_id,
                key
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status == 200) {
                console.log(`Screenshot deleted successfully`, response);
                enqueueSnackbar("Screenshot deleted", {
                    variant: 'success'
                });
                fetchAppDetails();
            }

        }
        catch (error) {
            console.error('Error deleting screenshot', error)
        }
    };

    const handleUploadNewScreenshot = async () => {
        if (!newScreenshotFile || newScreenshotFile.length === 0) {
            enqueueSnackbar("Please select a file first", {
                variant: 'warning'
            });
            return;
        }
        const formData = new FormData();
        newScreenshotFile.forEach((file, index) => {
            formData.append('screenshot', file); // use a consistent key for all files
        });
        formData.append('app_id', app_id);
        try {
            const response = await axios.post('http://localhost:4000/app/uploadnewscreenshot', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                enqueueSnackbar("Screenshot uplaoded successfully", {
                    variant: 'success'
                });
                console.log(response.data);
                // Fetch the updated list of screenshots
                fetchAppDetails();
                // Clear the file input field
                fileInputRef.current.value = '';
                // Optionally, you can also clear the newScreenshotFile state
                setnewScreenshotFile([]);
            }
        } catch (error) {
            console.error('Error uploading screenshot:', error);
            enqueueSnackbar("Failed to upload screenshot", {
                variant: 'error'
            });
        }
    };
    const handleUploadNewAppIcon = async () => {
        if (!newAppIcon || newAppIcon.length === 0) {
            enqueueSnackbar("Please select a file first", {
                variant: 'warning'
            });
            return;
        }
        const formData = new FormData();
        formData.append('appicon', newAppIcon); // use a consistent key for all files
        formData.append('app_id', app_id);
        try {
            const response = await axios.post('http://localhost:4000/app/updateappicon', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                enqueueSnackbar("App icon updated successfully", {
                    variant: 'success'
                });
                console.log(response.data);
                setShowAppIconInput(false); // Hide the input field after successful upload
                setnewAppIcon(null); //
                // Fetch the updated list of screenshots
                fetchAppDetails();
                // Clear the file input field
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error uploading app icon', error);
            enqueueSnackbar("Failed to upload app icon", {
                variant: 'error'
            });
        }
    };
    const handleUploadNewVideo = async () => {
        if (!newAppVideo || newAppVideo.length === 0) {
            enqueueSnackbar("Please select a file first", {
                variant: 'warning'
            });
            return;
        }
        const formData = new FormData();
        formData.append('appvideo', newAppVideo); // use a consistent key for all files
        formData.append('app_id', app_id);
        try {
            const response = await axios.post('http://localhost:4000/app/updateappvideo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 201) {
                enqueueSnackbar("App video updated successfully", {
                    variant: 'success'
                });
                fetchAppDetails();
                console.log(response.data);
                setAppVideoInput(false); // Hide the input field after successful upload
                setnewAppVideo(null); //
                // Fetch the updated list of screenshots

                // Clear the file input field
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error uploading app icon', error);
            enqueueSnackbar(`Failed to upload app icon ${error}`, {
                variant: 'error'
            });
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
    const handleApproveOrReject = (newStatus) => {
        const allTestsApproved = testCases.every(
            (testCase) => testStatuses[testCase].S === 'Passed' || testStatuses[testCase].S === 'Failed'
        );

        if (!allTestsApproved) {
            enqueueSnackbar("Please make sure to pass/fail every test cases", {
                variant: 'error'
            });
            return;
        }

        updateAppStatus(newStatus);
    };
    const updateAppStatus = async (newStatus) => {
        try {
            const response = await axios.post(`http://localhost:4000/app/updatestatus/${app_id}`, {
                status: newStatus
            });
            if (response.status === 200) {
                enqueueSnackbar("App Approved", {
                    variant: 'success'
                });
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
                enqueueSnackbar("App deleted Successfully", {
                    variant: 'success'
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
        setIsEditMode(!isEditMode);
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
                enqueueSnackbar("App details updated successfully", {
                    variant: 'success'
                });
                navigate('../Myapps');
            } else {
                console.error('Failed to update app details');
            }
        } catch (error) {
            console.error('Error updating app details:', error);
            enqueueSnackbar("Failed to update app details", {
                variant: 'error'
            });
        }
    };

    const gotoAnalysisPage = () => {
        navigate('../AppAnalysis', { state: { app_id: app_id } });
    };

    const mobsfpdfReport = async (hashValue) => {
        const formData = new FormData();
        formData.append('hash', hashValue);
        try {
            const response = await axios.post("http://localhost:8001/api/v1/download_pdf", formData, {
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
                        <div id="deleteappbutton" onClick={() => setIsConfirmModalOpen(true)}>
                            <PrimaryButton buttonText="Delete" />
                        </div>
                    }

                    {role === "tester" &&
                        <div id="buttoncontainer">
                            <div id="analysisbtn" onClick={() => gotoAnalysisPage()} >
                                <PrimaryButton buttonText="Analysis" />
                            </div>
                            <div id="bigbtn" onClick={() => mobsfpdfReport(hashValue)} >
                                <BigButton buttonText="Download Report" />
                            </div>
                        </div>
                    }

                    <div className='selection-container'>
                        <p className={activeTab === 'basic-info' ? 'basic-info active' : 'basic-info'} onClick={handleBasicInfoClick}>BASIC INFO</p>
                        <p className={activeTab === 'media' ? 'media active' : 'media'} onClick={handleMediaClick}>MEDIA</p>
                        {role === "tester" && (
                            <p className={activeTab === 'validation' ? 'validation active' : 'validation'} onClick={handleValidationClick}>VALIDATION</p>
                        )}
                    </div>
                    {displayBasicInfo && (
                        <div className="app-info1" >
                            {role === "developer" &&
                                <div id="editappbutton" onClick={() => handleEdit()}>
                                    <img src={EditIcon} className='appinfo-edit-icon' />
                                </div>
                            }
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
                            <div className='eachDetail'>
                                <span className="info-label">Status:</span>
                                <span className='statusvalue'>{appDetails.status}</span>
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
                            <br></br>
                        </div>

                    )}
                    <br />
                    {displayMediaInfo && (
                        <div className="app-info2" >
                            <div className="media-section">
                                <div className="screenshots">
                                    <h3 className="text-xl font-semibold mb-4">Screenshots</h3>
                                    <div id="screenshot-list">
                                        {screenshotFile.map((screenshot, index) => (
                                            <div key={index} className="screenshot-container">
                                                <p className='index-no'>{index + 1}</p>
                                                <img className="screenshot"
                                                    src={screenshot.url} // Use the backend endpoint
                                                    alt={`Screenshot ${index}`}
                                                />
                                                {role === "developer" &&
                                                    <img className='delete-icon' src={DeleteIcon} onClick={() => { handleDeleteScreenshot(app_id, screenshot.key) }} />
                                                }
                                            </div>
                                        ))}
                                    </div>
                                    {role === "developer" &&
                                        <div>
                                            <input type="file" multiple onChange={handleScreenshotFileChange} ref={fileInputRef} />
                                            <button className='upload-screenshot' onClick={handleUploadNewScreenshot} >Upload</button>
                                        </div>
                                    }
                                </div>
                                <br></br>
                                <div id="app-icons">
                                    <h3 className="text-xl font-semibold mb-4">App Icon</h3>
                                    <div className="app-icon-list">
                                        {appiconFile.map((icon, index) => (
                                            <img key={index} src={icon.url} alt={`App Icon ${index}`} />
                                        ))}
                                    </div>
                                    {role === "developer" &&
                                        <div>
                                            {!showAppIconInput ? (
                                                <img src={EditIcon} className='edit-appicon' onClick={handleEditAppIcon} />
                                            ) : (
                                                <div>
                                                    <input type="file" onChange={handleAppIconFileChange} />
                                                    <button className='upload-screenshot' onClick={handleUploadNewAppIcon}>Upload</button>
                                                </div>
                                            )}
                                        </div>
                                    }
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
                                    {role === "developer" &&
                                        <div>
                                            {!showAppVideoInput ? (
                                                <img src={EditIcon} className='edit-appvideo' onClick={handleEditAppVideo} />
                                            ) : (
                                                <div>
                                                    <input type="file" onChange={handleAppVideoFileChange} />
                                                    <button className='upload-screenshot' onClick={handleUploadNewVideo}>Upload</button>
                                                </div>
                                            )}
                                        </div>
                                    }
                                </div>
                                <br></br>
                            </div>
                        </div>
                    )}
                </div>
                {isEditMode && (
                    <div className='updatebutton' onClick={handleUpdate}>
                        <PrimaryButton
                            buttonText="Update"
                        />
                    </div>
                )}
            </div>


            {role === 'tester' && displayValidationInfo && (
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
                                            className={`pass-buttons  ${(appDetails.status === "Approved" || appDetails.status === "Rejected" || testStatuses[testCase].S === "Passed" || testStatuses[testCase].S === "Failed") ? 'disabled' : ''}`}
                                            onClick={() => {
                                                if (!(testStatuses[testCase] && testStatuses[testCase].S === "Passed")) {
                                                    const newTestStatuses = { ...testStatuses, [testCase]: { S: "Passed" } };
                                                    setTestStatuses(newTestStatuses);
                                                    handleUpdateTestcase(app_id, testCase, "Passed");
                                                }
                                            }}
                                        >
                                            <PrimaryButton buttonText="Pass" />
                                        </div>
                                        <div
                                            className={`fail-buttons ${(appDetails.status === "Approved" || appDetails.status === "Rejected" || testStatuses[testCase].S === "Passed" || testStatuses[testCase].S === "Failed") ? 'disabled' : ''}`}
                                            onClick={() => {
                                                if (!(testStatuses[testCase] && testStatuses[testCase].S === "Failed")) {
                                                    const newTestStatuses = { ...testStatuses, [testCase]: { S: "Failed" } };
                                                    setTestStatuses(newTestStatuses);
                                                    handleUpdateTestcase(app_id, testCase, "Failed");
                                                }
                                            }}
                                        >
                                            <SecondaryButton buttonText="Fail" />
                                        </div>
                                        <div>
                                        <p className='statusresult'>{testStatuses[testCase] && testStatuses[testCase].S}</p>
                                        </div>
                                        <img
                                            src={EditIcon}
                                            className={`edit-icon ${appDetails.status === "Approved" || appDetails.status === "Rejected" ? 'disabled' : ''}`}
                                            onClick={() => {
                                                if (appDetails.status !== "Approved" && appDetails.status !== "Rejected") {
                                                    const newTestStatuses = { ...testStatuses,  [testCase]: { S: "not done" }};
                                                    setTestStatuses(newTestStatuses);
                                                    handleUpdateTestcase(app_id, testCase, "not done");
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='finalbtns'>
                        <button className={`approve-button  ${(appDetails.status === "Approved" || appDetails.status === "Rejected") ? 'disabled' : ''}`} onClick={() => handleApproveOrReject("Approved")} >
                            Approve
                        </button>
                        <ConfirmationModal
                            isOpen={isConfirmModalOpen}
                            onClose={() => setIsConfirmModalOpen(false)}
                            onConfirm={handleDelete}
                        />
                        <button className={`reject-button  ${(appDetails.status === "Approved" || appDetails.status === "Rejected") ? 'disabled' : ''}`} onClick={() => handleApproveOrReject("Rejected")} >
                            Reject
                        </button>
                    </div>
                </div>
            )}


        </div>
    );
}

export default AppDetails;
