import React, { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';

const ImageUpload = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 10) {
      setError('You can upload up to 10 images only.');
    } else {
      setSelectedImages((prevImages) => [...prevImages, ...files]);
      setError('');
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
  };

  return (
    <div className="max-w-xl mx-auto p-4 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload Car Images</h2>
      
      {/* Image Upload Button */}
      <div className="flex items-center justify-start space-x-2 cursor-pointer mb-4">
        <FaCloudUploadAlt className="text-3xl text-blue-600" />
        <label htmlFor="image-upload" className="text-blue-600 font-semibold cursor-pointer">
          Upload Images
        </label>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Error message */}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Displaying Image Previews */}
      <div className="grid grid-cols-3 gap-4">
        {selectedImages.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(image)}
              alt={`preview-${index}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-1"
            >
              X
            </button>
          </div>
        ))}
      </div>

      <p className="mt-4 text-gray-600">
        You can upload up to <strong>10 images</strong>.
      </p>

      <button
        type="submit"
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        Submit
      </button>
    </div>
  );
};

export default ImageUpload;
