import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar';
import { useNavigate } from 'react-router-dom';
import Primarybtn from './Components/PrimaryButton';
import { useFormData } from './FormDataContext';
import Input from './Components/Inputfield';
import './Upload.css';

const FileUploadModal = () => {
  const { formData, updateFormData } = useFormData();
  const [screenshotFile, setScreenshotFile] = useState(formData.screenshotfile || []);
  const [iconFile, setAppiconFile] = useState(formData.appiconfile || []);
  const [videoFile, setVideoFile] = useState(formData.appVideo || null);
  const [apkFile, setApkFile] = useState(formData.apkFile || null);
  const [apkName, setApkName] = useState(formData.apkName || '');
  const [ageRating, setAgeRating] = useState(formData.ageRating || '');
  const [appCategory, setCategory] = useState(formData.appCategory || '');
  const [tags, setTags] = useState(formData.tags || '');
  const [appShortDescription, setShortDescription] = useState(formData.appShortDescription || '');
  const [appLongDescription, setLongDescription] = useState(formData.appLongDescription || '');
  const [supportUrl, setSupportURL] = useState(formData.supportUrl || '');
  const [websiteUrl, setWebsiteURL] = useState(formData.websiteUrl || '');
  const [price, setPrice] = useState(formData.price || '');


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
      price,
      videoFile,
      screenshotFile,
      iconFile,
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
    price,
    videoFile,
    screenshotFile,
    iconFile,
    apkFile,
    updateFormData
  ]);



  const handleClose = () => {
    window.location.href = './Myapps';
  };

  const handleApkFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setApkFile(selectedFile);
  };


  const handlevideoFileChange = (e) => {
    const selectedFiles = e.target.files;
    const renamedFiles = Array.from(selectedFiles).map((file, index) => {
      const fileType = file.type.split('/')[0]; // Determine the file type (e.g., image, video, application)
      const newFileName = `video${index}${fileType}_${Date.now()}_${file.name}`; // Generate a new name for the file
      return new File([file], newFileName, { type: file.type });
    });
    setVideoFile(renamedFiles);
  };

  const handlescreenshotFileChange = (e) => {
    const selectedFiles = e.target.files;
    const renamedFiles = Array.from(selectedFiles).map((file, index) => {
      const fileType = file.type.split('/')[0]; // Determine the file type (e.g., image, video, application)
      const newFileName = `screenshot${index}${fileType}_${Date.now()}_${file.name}`; // Generate a new name for the file
      return new File([file], newFileName, { type: file.type });
    });
    setScreenshotFile(renamedFiles);

  };


  const handleappiconFileChange = (e) => {
    const selectedFiles = e.target.files;
    const renamedFiles = Array.from(selectedFiles).map((file, index) => {
      const fileType = file.type.split('/')[0]; // Determine the file type (e.g., image, video, application)
      const newFileName = `appicon${index}${fileType}_${Date.now()}_${file.name}`; // Generate a new name for the file
      return new File([file], newFileName, { type: file.type });
    });
    setAppiconFile(renamedFiles);

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
  const handlePriceChange = (e) => {
    setPrice(e.target.value);
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
      price,
      videoFile,
      screenshotFile,
      iconFile,
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
        <h2 id="uploadTitle" className="text-xl font-bold  mt-6 mb-6">Upload APK</h2>
        <form id="uploadForm" onSubmit={handlePreview} className="flex flex-col gap-4">


          <div id="apkNameInput">
            <Input label="APK Name" inputType="text" value={apkName} onChange={handleApkNameChange} />
          </div>

          <div id="ageRating">
            <label id="Category">Age Rating</label><br></br>
            <select id="categorySelect" value={ageRating} onChange={handleAgeRatingChange} required>
              <option value="">Select</option>
              <option value="5+">5+</option>
              <option value="9+">9+</option>
              <option value="16+">16+</option>
              <option value="18+">18+</option>
            </select>
          </div>

          <div id="apkCategory">
            <label id="Category">Category</label><br></br>
            <select id="categorySelect" value={appCategory} onChange={handleCategoryChange} required>
              <option value="">Select</option>
              <option value="Music">Music</option>
              <option value="Movie">Movie</option>
              <option value="Sports">Sports</option>
              <option value="News">News</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>

          <div id="apkTags" >
            <Input label="Tags" inputType="text" value={tags} onChange={handleTags} />
          </div>

          <div id="supporturlInput" >
            <Input label="Supporting URL" inputType="text" value={supportUrl} onChange={handlesupportUrl} />
          </div>

          <div id="websiteurlInput" >
            <Input label="Website URL" inputType="text" value={websiteUrl} onChange={handleWebsiteUrl} />
          </div>

          <div >
            <label id="shortDescLabel">Short Description</label>
            <textarea id="shortDesc" value={appShortDescription} onChange={handleShortDescriptionChange} ></textarea>
          </div>

          <div >
            <label id="longDescLabel">Long Description</label>
            <textarea id="longDesc" value={appLongDescription} onChange={handleLongDescriptionChange}></textarea>
          </div>

          <div id="sampleScreenshotContainer" className="flex flex-col">
            <label>Sample Screenshots:</label>
            <input id="sampleScreenshotInput" type="file" multiple onChange={handlescreenshotFileChange} required />
          </div>
          <div id="sampleVideoContainer" className="flex flex-col">
            <label>Sample Videos:</label>
            <input id="sampleVideoInput" type="file" onChange={handlevideoFileChange} required />
          </div>
          <div id="appIconContainer" className="flex flex-col">
            <label>App Icons:</label>
            <input id="appIconInput" type="file" onChange={handleappiconFileChange} required />
          </div>
          <div id="uploadAPKContainer" className="flex flex-col">
            <label>Upload APK File:</label>
            <input id="uploadAPKInput" type="file" onChange={handleApkFileChange} required />
          </div>
          <div id="priceinput">
            <Input label="Enter Price (USD)" inputType="text" value={price} onChange={handlePriceChange} />
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
