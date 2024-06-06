import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../Components/Navbar';
import TesterNavbar from '../Components/TesterNavbar';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Css/Preview.css';
import Primarybtn from '../Components/PrimaryButton';
import Secondarybtn from '../Components/SecondaryButton';
import Loading from '../Components/FoursquareLoading';
import { SnackbarProvider, useSnackbar } from 'notistack'
const Preview = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const previewData = location.state.previewData;
  const role = localStorage.getItem('role');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { apkName,
    ageRating,
    appCategory,
    tags,
    appShortDescription,
    appLongDescription,
    supportUrl,
    websiteUrl,
    price,
    videoFile,
    screenshotFile,
    iconFile,
    apkFile } = previewData;
  console.log(previewData);

  const handleEdit = () => {
    console.log("clicked");
    navigate('/Upload', { state: { formData: previewData } }); // Navigate to the upload page
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!apkFile) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('apkFile', apkFile);
    formData.append('apkName', apkName);
    formData.append('ageRating', ageRating);
    formData.append('appCategory', appCategory);
    formData.append('tags', tags);
    formData.append('supportUrl', supportUrl);
    formData.append('websiteUrl', websiteUrl);
    formData.append('price', price);
    screenshotFile.forEach((file, index) => {
      formData.append(`screenshotfile-${index}`, file);
    });
    iconFile.forEach((file, index) => {
      formData.append(`appiconfile-${index}`, file);
    });
    formData.append('appShortDescription', appShortDescription);
    formData.append('appLongDescription', appLongDescription);
    videoFile.forEach((file, index) => {
      formData.append(`videoFile-${index}`, file);
    })
 
    try {
      // POST request to upload the file
      console.log(`formDataaa at previeww`, formData);
      const response = await axios.post('http://localhost:4000/uploadapp/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      enqueueSnackbar("App Uploaded successfully",{
        variant:'success'
      });
      navigate('../Myapps');
      setLoading(false);
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
        {/* Conditional rendering based on the role */}
        {role === 'developer' && <Navbar />}
        {role === 'tester' && <TesterNavbar />}
      </div>
      {loading && <Loading />}
      <div className="popup">
        <div className="popup-content">
          {/* <span className="close" onClick={handleEdit}>&times;</span> */}
          <h1 className='previewtxt'>Preview</h1>
          <label id="appnamepr" className="block text-sm font-medium leading-6 text-gray-900">
            <span style={{ fontWeight: 'bolder' }}>App name:</span><br />
            <span style={{ fontWeight: 'lighter' }}>{apkName}</span>
          </label>

          <label id="appversionpr" className="block text-sm font-medium leading-6 text-gray-900">
            <span style={{ fontWeight: 'bolder' }}>Age Rating:</span><br />
            <span style={{ fontWeight: 'lighter' }}>{ageRating}</span>
          </label>

          <label id="appversionpr" className="block text-sm font-medium leading-6 text-gray-900">
            <span style={{ fontWeight: 'bolder' }}>Category:</span><br />
            <span style={{ fontWeight: 'lighter' }}>{appCategory}</span>
          </label>

          <label id="appversionpr" className="block text-sm font-medium leading-6 text-gray-900">
            <span style={{ fontWeight: 'bolder' }}>Tags:</span><br />
            <span style={{ fontWeight: 'lighter' }}>{tags}</span>
          </label>

          <label id="appdescpr" className="block text-sm left-10 font-medium leading-6 text-gray-900">
            <span style={{ fontWeight: 'bolder' }}>Short description:</span><br />
            <span style={{ fontWeight: 'lighter' }}>{appShortDescription}</span>
          </label>

          <label id="appversionpr" className="block text-sm font-medium leading-6 text-gray-900">
            <span style={{ fontWeight: 'bolder' }}>Long Description:</span><br />
            <span style={{ fontWeight: 'lighter' }}>{appLongDescription}</span>
          </label>

          <label id="supporturlpr" className="block text-sm font-medium leading-6 text-gray-900">
            <span style={{ fontWeight: 'bolder' }}>Support URL:</span><br />
            <span style={{ fontWeight: 'lighter' }}>{supportUrl}</span>
          </label>

          <label id="contacturlpr" className="block text-sm font-medium leading-6 text-gray-900">
            <span style={{ fontWeight: 'bolder' }}>Website URL:</span><br />
            <span style={{ fontWeight: 'lighter' }}>{websiteUrl}</span>
          </label>
          
          <label id="contacturlpr" className="block text-sm font-medium leading-6 text-gray-900">
            <span style={{ fontWeight: 'bolder' }}>Price:</span><br />
            <span style={{ fontWeight: 'lighter' }}>{price}$</span>
          </label>

          <label id="screenshotpr" className="block text-sm font-medium leading-6 text-gray-900">
            <span style={{ fontWeight: 'bolder' }}>Sample Screenshots:</span>
          </label>

          {screenshotFile.map((file, index) => (
            <img key={index} src={URL.createObjectURL(file)} alt={`Screenshot ${index}`} />
          ))}
          <br></br>
          <label id="videopr"> Sample Videos: </label>
          {videoFile.map((file, index) => (
            <video key={index} controls src={URL.createObjectURL(file)} />
          ))}
          <br></br>
          <label id="iconpr"> App Icon: </label>
          {iconFile.map((file, index) => (
            <img key={index} src={URL.createObjectURL(file)} alt={`App Icon ${index}`} />
          ))}
          <br></br>
          <div className="flex justify-start">
            <div onClick={handleEdit} className='left-0 ml-5'>
              <Secondarybtn buttonText="Edit" />
            </div>
            <div onClick={handleSubmit} id="submitbtn" className='left-0 ml-40'>
              <Primarybtn buttonText="Submit" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
export default Preview;

