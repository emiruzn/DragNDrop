import React from 'react';
import addPhotoIcon from '../../assets/add_photo.svg'; // Adjust the path as necessary
import './ImageUpload.css';

const ImageUpload = ({ id, image, onImageChange }) => {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(id, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-upload-container">
      <label htmlFor={`file-upload-${id}`} className="image-upload-placeholder">
        <img src={image || addPhotoIcon} alt="Add Photo" />
      </label>
      <input
        id={`file-upload-${id}`}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default ImageUpload;
