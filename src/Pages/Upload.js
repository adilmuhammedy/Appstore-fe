import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import Primarybtn from '../Components/PrimaryButton';
import { useFormData } from './FormDataContext';
import Input from '../Components/Inputfield';
import '../Css/Upload.css';

const FileUploadModal = () => {
  const { formData, updateFormData } = useFormData();
  const [screenshotFile, setScreenshotFile] = useState(formData.screenshotFile || []);
  const [iconFile, setAppIconFile] = useState(formData.appIconFile || null);
  const [videoFile, setVideoFile] = useState(formData.videoFile || null);
  const [apkFile, setApkFile] = useState(formData.apkFile || null);
  const [apkName, setApkName] = useState(formData.apkName || '');
  const [ageRating, setAgeRating] = useState(formData.ageRating || '');
  const [appCategory, setCategory] = useState(formData.appCategory || '');
  const [tags, setTags] = useState(formData.tags || '');
  const [appShortDescription, setShortDescription] = useState(formData.appShortDescription || '');
  const [appLongDescription, setLongDescription] = useState(formData.appLongDescription || '');
  const [supportUrl, setSupportUrl] = useState(formData.supportUrl || '');
  const [websiteUrl, setWebsiteUrl] = useState(formData.websiteUrl || '');
  const [supportUrlError, setSupportUrlError] = useState('');
  const [websiteUrlError, setWebsiteUrlError] = useState('');
  const [price, setPrice] = useState(formData.price || '');
  const [priceError, setPriceError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const newFormData = {
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
    };

    if (JSON.stringify(formData) !== JSON.stringify(newFormData)) {
      updateFormData(newFormData);
    }
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
    updateFormData,
    formData
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
      const fileType = file.type.split('/')[0];
      const newFileName = `video${index}${fileType}_${Date.now()}_${file.name}`;
      return new File([file], newFileName, { type: file.type });
    });
    setVideoFile(renamedFiles);
  };

  const handlescreenshotFileChange = (e) => {
    const selectedFiles = e.target.files;
    const renamedFiles = Array.from(selectedFiles).map((file, index) => {
      const fileType = file.type.split('/')[0];
      const newFileName = `screenshot${index}${fileType}_${Date.now()}_${file.name}`;
      return new File([file], newFileName, { type: file.type });
    });
    setScreenshotFile(renamedFiles);
  };

  const handleappiconFileChange = (e) => {
    const selectedFiles = e.target.files;
    const renamedFiles = Array.from(selectedFiles).map((file, index) => {
      const fileType = file.type.split('/')[0];
      const newFileName = `appicon${index}${fileType}_${Date.now()}_${file.name}`;
      return new File([file], newFileName, { type: file.type });
    });
    setAppIconFile(renamedFiles);
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
  const validateUrl = (url) => {
    const urlPattern = /^(https?|http|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    if (!url) {
      return 'URL is required';
    } else if (!urlPattern.test(url)) {
      return 'Invalid URL format';
    }
    return '';
  };
  const handlesupportUrl = (e) => {
    const newSupportUrl = e.target.value;
    setSupportUrl(newSupportUrl);
    const error = validateUrl(newSupportUrl);
    setSupportUrlError(error); // Set the error message if any
  };
  const handleWebsiteUrl = (e) => {
    const newWebsiteUrl = e.target.value;
    setWebsiteUrl(newWebsiteUrl);
    const error = validateUrl(newWebsiteUrl);
    setWebsiteUrlError(error); // Set the error message if any
  };
  const handleShortDescriptionChange = (e) => {
    setShortDescription(e.target.value);
  };
  const handleLongDescriptionChange = (e) => {
    setLongDescription(e.target.value);
  };
  const handlePriceChange = (e) => {
    const newPrice = e.target.value;
    setPrice(newPrice);
    
    // Check if the input contains only numbers
    const isValid = /^\d*$/.test(newPrice);
    
    if (!isValid) {
      setPriceError('Price must contain only numbers');
    } else {
      setPriceError('');
    }
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
        <h2 id="uploadTitle" className="text-xl font-bold mt-6 mb-6">Upload APK</h2>
        <form id="uploadForm" onSubmit={handlePreview} className="flex flex-col gap-4">
          <div id="apkNameInput" className="absolute top-18 left-24">
            <Input label="APK Name" inputType="text" value={apkName} onChange={handleApkNameChange} />
          </div>
          <div id="ageRating" className="absolute top-40 left-24">
            <label id="Category">Age Rating</label><br />
            <select id="categorySelect" className="mt-2 w-56 h-9 border border-gray-300 rounded-md" value={ageRating} onChange={handleAgeRatingChange} required>
              <option value="">Select</option>
              <option value="5+">5+</option>
              <option value="9+">9+</option>
              <option value="16+">16+</option>
              <option value="18+">18+</option>
            </select>
          </div>
          <div id="apkCategory" className="absolute top-60 left-24">
            <label id="Category">Category</label><br />
            <select id="categorySelect" className="mt-2 w-56 h-9 border border-gray-300 rounded-md" value={appCategory} onChange={handleCategoryChange} required>
              <option value="">Select</option>
              <option value="Music">Music</option>
              <option value="Movie">Movie</option>
              <option value="Sports">Sports</option>bh9
              <option value="News">News</option>
              <option value="Games">Games</option>
              <option value="Social media">Social Media</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>
          <div id="apkTags" className="absolute top-80 left-24">
            <Input label="Tags" inputType="text" value={tags} onChange={handleTags} />
          </div>
          <div id="supporturlInput" className="absolute top-100 left-24">
            <Input label="Supporting URL" inputType="text" value={supportUrl} onChange={handlesupportUrl} />
            {supportUrlError && <span className="supporturl-error">{supportUrlError}</span>}
          </div>
          <div id="websiteurlInput" className="absolute top-120 left-24">
            <Input label="Website URL" inputType="text" value={websiteUrl} onChange={handleWebsiteUrl} />
            {websiteUrlError && <span className="websiteurl-error">{websiteUrlError}</span>}
          </div>
          <div id="shortDescContainer" className="absolute top-140 left-24">
            <label id="shortDescLabel">Short Description</label><br />
            <textarea id="shortDesc" className="mt-2 w-75 h-30 border border-gray-300 rounded-md" required value={appShortDescription} onChange={handleShortDescriptionChange}></textarea>
          </div>
          <div className="rhs">
            <div id="longDescContainer" className="absolute top-18 left-136">
              <label id="longDescLabel">Long Description</label><br />
              <textarea id="longDesc" className="mt-2 w-75 h-52 border border-gray-300 rounded-md" required value={appLongDescription} onChange={handleLongDescriptionChange}></textarea>
            </div>
            <div id="priceInput" className="absolute top-100 left-136">
              <Input label="Price (USD)" inputType="text" value={price} onChange={handlePriceChange} />
              {priceError && <span className="price-error">{priceError}</span>}
            </div>
            <div id="screenshotUploadContainer" className="absolute top-190 left-136">
              <label id="screenshotUpload" htmlFor="screenshotFile" className="cursor-pointer">Upload Screenshots</label>
              <input id="screenshotFile" className="mt-2" type="file" multiple accept="image/*" required onChange={handlescreenshotFileChange} />
            </div>
            <div id="appIconUploadContainer" className="absolute top-220 left-136">
              <label id="appIconUpload" htmlFor="iconFile" className="cursor-pointer">Upload App Icon</label><br></br>
              <input id="iconFile" className="mt-2" type="file" multiple accept="image/*" required onChange={handleappiconFileChange} />
            </div>
            <div id="videoUploadContainer" className="absolute top-160 left-136">
              <label id="videoUpload" htmlFor="videoFile" className="cursor-pointer">Upload Videos</label><br></br>
              <input id="videoFile" className="mt-2" type="file" multiple accept="video/*" required onChange={handlevideoFileChange} />
            </div>
            <div id="apkUploadContainer" className="absolute top-130 left-136">
              <label id="apkFileUpload" htmlFor="apkFile" className="cursor-pointer">Upload APK</label><br></br>
              <input id="apkFile" className="mt-2" type="file" accept=".apk" required onChange={handleApkFileChange} />
            </div>
          </div>
          <div id="previewButtonContainer" className="absolute left-100 top-240 mb-24">
            <Primarybtn buttonText="Preview" onClick={handlePreview} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileUploadModal;
