import React, { useState } from 'react';
import axios from 'axios'; 
import './Home.css';
import Navbar from './Components/Navbar';

function Home() {
    const [file, setFile] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!file) {
          console.error('No file selected');
          return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
    
        try {
          // POST request to upload the file
          const response = await axios.post('http://localhost:4000/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          window.alert('File uploaded successfully:', response.data);
          setShowModal(false);
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
        <div className="home-container">
            <div style={{ display: 'flex' }}>
                <Navbar/>
            </div>
            <div id="upload-card">
                <h1 id="upload-apk">Upload APK</h1>
                <button id="upload-btn" onClick={() => setShowModal(true)}>Upload</button>
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                            <h2>Upload File</h2>
                            <form onSubmit={handleSubmit}>
                                <input type="file" onChange={handleFileChange} />
                                <button type="submit">Submit</button>
                                <input type="text" placeholder='Enter apk name' className='nameip' required></input>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
