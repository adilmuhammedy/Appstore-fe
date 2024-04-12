import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar';
import { useNavigate } from 'react-router-dom';
import Primarybtn from './Components/primaryButton';
import { useFormData } from './FormDataContext';
import Input from './Components/Inputfield';
import './Upload.css';

const FileUploadModal = () => {
  const { formData, updateFormData } = useFormData();
  const [screenshotfile, setscreenshotFile] = useState(formData.screenshotfile || []);
  const [appiconfile, setappiconFile] = useState(formData.appiconfile || []);
  const [apkName, setApkName] = useState(formData.apkName || '');
  const [ageRating, setAgeRating] = useState(formData.ageRating || '');
  const [appCategory, setCategory] = useState(formData.appCategory || '');
  const [tags, setTags] = useState(formData.tags || '');
  const [appShortDescription, setShortDescription] = useState(formData.appShortDescription || '');
  const [appLongDescription, setLongDescription] = useState(formData.appLongDescription || '');
  const [supportUrl, setSupportURL] = useState(formData.supportUrl || '');
  const [websiteUrl, setWebsiteURL] = useState(formData.websiteUrl || '');
  const [appVideo, setAppVideo] = useState(formData.appVideo || null);
  const [apkFile, setApkFile] = useState(formData.apkFile || null);
  const navigate = useNavigate();

  useEffect(() => {
    updateFormData({
 
      apkName,
      ageRating,
      appCategory,
      tags,
      appShortDescription,
      appLongDescription,
      supportUrl,
      websiteUrl,
      appVideo,
      screenshotfile,
      appiconfile,
      apkFile,
    });
  }, [      
    apkName,
    ageRating,
    appCategory,
    tags,
    appShortDescription,
    appLongDescription,
    supportUrl,
    websiteUrl,
    appVideo,
    screenshotfile,
    appiconfile,
    apkFile,
    updateFormData
  ]);



  const handleClose = () => {
    window.location.href = './Home';
  };

  const handleApkFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setApkFile(selectedFile);
  };


  const handlevideoFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setAppVideo(selectedFile);
  };

  const handlescreenshotFileChange = (e) => {
    const screenshotfile = Array.from(e.target.files);
    setscreenshotFile(screenshotfile);
  };


  const handleappiconFileChange = (e) => {
    const selectedFile = Array.from(e.target.files);
    setappiconFile(selectedFile);
  };

  const handleApkNameChange = (e) => {
    setApkName(e.target.value);
  };
  const handleAgeRatingChange = (e) => {
    setAgeRating(e.target.value);
  };
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  const handleTags = (e) => {
    setTags(e.target.value);
  };
  const handlesupportUrl = (e) => {
    setSupportURL(e.target.value);
  };
  const handleWebsiteUrl = (e) => {
    setWebsiteURL(e.target.value);
  };
  const handleShortDescriptionChange = (e) => {
    setShortDescription(e.target.value);
  };
  const handleLongDescriptionChange = (e) => {
    setLongDescription(e.target.value);
  };

  const handlePreview = async () => {
    const previewData = {
      apkName,
      ageRating,
      appCategory,
      tags,
      appShortDescription,
      appLongDescription,
      supportUrl,
      websiteUrl,
      appVideo,
      screenshotfile,
      appiconfile,
      apkFile
    };

    // Navigate to the preview page with previewData
    navigate('/Preview', { state: { previewData } });
  };

  return (
    <div>
      <Navbar />
      <div id="uploadcontainer" className="fixed right-16 top-12 w-2/3 md:w-120 h-172 bg-white rounded-lg shadow-lg overflow-y-auto flex flex-col justify-center items-center">


      <span id="closeBtn" className="absolute top-2 right-2 cursor-pointer" onClick={handleClose}>&times;</span>
<h2 id="uploadTitle" className="text-xl font-bold mb-6">Upload APK</h2>
<form id="uploadForm" onSubmit={handlePreview} className="flex flex-col gap-4">
 
  
      <div id="apkNameInput">
      <Input label="APK Name" inputType="text" value={apkName} onChange={handleApkNameChange} />
      </div>

      <div id="ageRating">
      <Input label="Age Rating" inputType="text" value={ageRating} onChange={handleAgeRatingChange} />
    </div>

      <div id="apkCategory">
      <Input label="Category"  inputType="text" value={appCategory} onChange={handleCategoryChange} />
      </div>

      <div id="apkTags" >
      <Input label="Tags"  inputType="text" value={tags} onChange={handleTags} />
      </div>

      <div >
        <label id="shortDescLabel">Short Description</label>
      <textarea id="shortDesc"  value={appShortDescription} onChange={handleShortDescriptionChange} ></textarea>
      </div>

      <div >
      <label id="longDescLabel">Long Description</label>
      <textarea id="longDesc" value={appLongDescription} onChange={handleLongDescriptionChange}></textarea>
    </div>
 
   
      <div id="supporturlInput" >
      <Input label="Supporting URL" inputType="text" value={supportUrl} onChange={handlesupportUrl} />
      </div>

      <div id="websiteurlInput" >
      <Input label="Website URL" inputType="text" value={websiteUrl} onChange={handleWebsiteUrl} />
      </div>
  

    <div id="sampleScreenshotContainer" className="flex flex-col">
    <label>Sample Screenshots:</label>
    <input id="sampleScreenshotInput" type="file" onChange={handlescreenshotFileChange} />
  </div>
  <div id="sampleVideoContainer" className="flex flex-col">
    <label>Sample Videos:</label>
    <input id="sampleVideoInput" type="file" onChange={handlevideoFileChange} />
  </div>
  <div id="appIconContainer" className="flex flex-col">
    <label>App Icons:</label>
    <input id="appIconInput" type="file" onChange={handleappiconFileChange} />
  </div>
  <div id="uploadAPKContainer" className="flex flex-col">
    <label>Upload APK File:</label>
    <input id="uploadAPKInput" type="file" onChange={handleApkFileChange} required />
  </div>
  <div id="previewButtonContainer">
    <Primarybtn id="previewButton" buttonText="Preview" />
  </div>
</form>

</div>
</div>
  );
};

export default FileUploadModal;
