import React, { useState } from 'react';
import './ImageSelector.css';

const TEMPLATE_IMAGES = [
  {
    name: 'Drake',
    url: 'https://i.imgflip.com/30b1gx.jpg'
  },
  {
    name: 'Distracted Boyfriend',
    url: 'https://i.imgflip.com/1ur9b0.jpg'
  },
  {
    name: 'Expanding Brain',
    url: 'https://i.imgflip.com/1jhl7s.jpg'
  },
  {
    name: 'Two Buttons',
    url: 'https://i.imgflip.com/1g8my4.jpg'
  },
  {
    name: 'Change My Mind',
    url: 'https://i.imgflip.com/24y43o.jpg'
  },
  {
    name: 'Woman Yelling at Cat',
    url: 'https://i.imgflip.com/345v97.jpg'
  }
];

function ImageSelector({ onImageSelect }) {
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageSrc = reader.result;
        setUploadedImage(imageSrc);
        onImageSelect(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemplateSelect = (templateUrl) => {
    setUploadedImage(null);
    onImageSelect(templateUrl);
  };

  return (
    <div className="image-selector">
      <h2>Select Image</h2>
      
      <div className="upload-section">
        <label htmlFor="file-upload" className="upload-button">
          Upload Image
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        {uploadedImage && (
          <p className="upload-status">Image uploaded successfully!</p>
        )}
      </div>

      <div className="templates-section">
        <h3>Or Choose a Template</h3>
        <div className="templates-grid">
          {TEMPLATE_IMAGES.map((template, index) => (
            <div
              key={index}
              className="template-item"
              onClick={() => handleTemplateSelect(template.url)}
            >
              <img
                src={template.url}
                alt={template.name}
                className="template-thumbnail"
              />
              <p className="template-name">{template.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageSelector;

