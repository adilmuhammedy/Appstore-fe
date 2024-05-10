import React, { useState, useEffect } from 'react';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import './EditModal.css';

function EditModal({ formData, onSubmit, onCancel }) {
    const [editedFormData, setEditedFormData] = useState(formData);

    // Populate input fields with current app details
    useEffect(() => {
        setEditedFormData(formData);
    }, [formData]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedFormData({ ...editedFormData, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(editedFormData);
    };

    return (
        <div className='edit-modal-container'>

       
        <div className="edit-modal">
            <h2>Edit App Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="apkName">App Name</label>
                    <input
                        type="text"
                        id="apkName"
                        name="appname"
                        value={editedFormData.appname}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="ageRating">Age Rating</label>
                    <input
                        type="text"
                        id="ageeRating"
                        name="ageRating"
                        value={editedFormData.ageRating}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="appCategory">Category</label>
                    <input
                        type="text"
                        id="appCategory"
                        name="appCategory"
                        value={editedFormData.appCategory}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="tags">Tags</label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={editedFormData.tags}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="supportUrl">Supporting URL</label>
                    <input
                        type="text"
                        id="supportUrl"
                        name="supportUrl"
                        value={editedFormData.supportUrl}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="websiteUrl">Website URL</label>
                    <input
                        type="text"
                        id="websiteUrl"
                        name="websiteUrl"
                        value={editedFormData.websiteUrl}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="appShortDescription">Short Description</label>
                    <textarea
                        id="appShortDescription"
                        name="appShortDescription"
                        value={editedFormData.appShortDescription}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="appLongDescription">Long Description</label>
                    <textarea
                        id="appLongDescription"
                        name="appLongDescription"
                        value={editedFormData.appLongDescription}
                        onChange={handleInputChange}
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="screenshotfile">Sample Screenshots</label>
                    <input
                        type="file"
                        id="screenshotfile"
                        name="screenshotfile"
                        onChange={handleInputChange}
                        multiple
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="appiconfile">App Icons</label>
                    <input
                        type="file"
                        id="appiconfile"
                        name="appiconfile"
                        onChange={handleInputChange}
                        multiple
                    />
                </div>
                <div className="button-container">
                    <div onClick={onCancel}>
                        <SecondaryButton buttonText="Cancel" />
                    </div>
                    <div>
                        <PrimaryButton buttonText="Submit" />
                    </div>
                </div>
            </form>
        </div>
        </div>
    );
}

export default EditModal;
