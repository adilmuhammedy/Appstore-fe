import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './Components/Navbar';
import './Upload.css';
const FileUploadModal = () => {
  const [file, setFile] = useState(null);
  const [apkName, setApkName] = useState('');
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');

  const handleClose = () => {
    window.location.href = './Home';
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleApkNameChange = (e) => {
    setApkName(e.target.value);
  };

  const handleAppNameChange = (e) => {
    setAppName(e.target.value);
  };

  const handleAppDescriptionChange = (e) => {
    setAppDescription(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('apkName', apkName);
    formData.append('appName', appName);
    formData.append('appDescription', appDescription);

    try {
      // POST request to upload the file
      const response = await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      window.alert('File uploaded successfully:', response.data);
      window.location.href = './Home';
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400 && error.response.data.error) {
          window.alert(error.response.data.error);
        } else {
          window.alert('An error occurred while uploading the file.');
          console.error('Error uploading file:', error.response);
        }
      } else if (error.request) {
        // The request was made but no response was received
        window.alert('No response received from the server.');
        console.error('Error uploading file:', error.request);
      } else {
        // Something happened in setting up the request that triggered an error
        window.alert('Error setting up the request.');
        console.error('Error uploading file:', error.message);
      }
    }
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={handleClose}>&times;</span>
          <h2 id="upload-txt">Upload File</h2>
          <form onSubmit={handleSubmit}>

            <label>APK name: </label>
            <input
              type="text"
              placeholder="Enter APK name"
              className="nameip"
              value={apkName}
              onChange={handleApkNameChange}
              required
            />
            <br></br>
            <label>APK Description: </label>
            <input
              type="text"
              placeholder="Enter App description"
              className="descip"
              value={appName}
              onChange={handleAppNameChange}
              required
            />
            <br></br>
            <label>Version info: </label>
            <input
              type="text"
              placeholder="Version"
              className="verip"
              value={appDescription}
              onChange={handleAppDescriptionChange}
              required
            />
            <br></br>
            <label>APK Permissions: </label>
            <input
              type="text"
              placeholder="permissions"
              className="permip"
              value={appDescription}
              onChange={handleAppDescriptionChange}
              required
            />
            <br></br>
            <label>Device Compatibility: </label>
            <input
              type="text"
              className="compip"
              value={appDescription}
              onChange={handleAppDescriptionChange}
              required
            />
            <br></br>
            <br></br>

            <label>Sample Screenshots: </label>
            <input type="file" />
            <br></br>
            <br></br>
            <label>Support contact info: </label>
            <input
              type="text"
              className="nameip"
              value={appDescription}
              onChange={handleAppDescriptionChange}
              required
            />
            <br></br>
            <br></br>
            <label>Upload apk file: </label>
            <input type="file" onChange={handleFileChange} />
            {/* Add more input fields as needed */}
            <br></br>
            <button type="submit" id="submit-btn">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
