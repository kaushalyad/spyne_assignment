import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCloudUploadAlt } from "react-icons/fa";
import api from "../utils/api"; // Ensure the api utility is set up for your API requests

const AddCar = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [carImages, setCarImages] = useState([]);
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle file input change
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length + carImages.length > 10) {
      setError("You can upload up to 10 images only.");
    } else {
      setCarImages((prevImages) => [...prevImages, ...validFiles]);
      setError("");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (carImages.length === 0) {
      setError("Please upload at least one image.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to add a car.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);

    // Add images to the formData
    carImages.forEach((image) => {
      formData.append("images", image);
    });
    console.log(formData);
    try {
      setIsLoading(true);
      const response = await api.post("http://localhost:5000/api/cars", formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },          
      });
      console.log("Car added:", response.data);
      setTitle("");
      setDescription("");
      setTags("");
      setCarImages([]);
      setIsLoading(false);
      navigate("/");
    } 
    catch (err) {
      const errorMessage =
        err.response && err.response.data
          ? err.response.data.message
          : "Failed to add car. Please try again later.";
      setError(errorMessage);
      setIsLoading(false);
      console.error("Error adding car:", err);
    }
  };

  // Remove image from the selected list
  const handleRemoveImage = (index) => {
    const updatedImages = carImages.filter((_, i) => i !== index);
    setCarImages(updatedImages);
  };

  return (
    <div className="max-w-xl mx-auto p-6 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Add a New Car
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Car Title */}
        <input
          type="text"
          placeholder="Car Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
          required
        />

        {/* Car Description */}
        <textarea
          placeholder="Car Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
          required
        />

        {/* Car Tags */}
        <input
          type="text"
          placeholder="Car Tags (e.g. car_type, company)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-md"
        />

        {/* Image Upload */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 cursor-pointer justify-center">
            <FaCloudUploadAlt className="text-3xl text-blue-600" />
            <label
              htmlFor="image-upload"
              className="text-blue-600 font-semibold cursor-pointer"
            >
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
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* Image Previews */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {carImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`preview-${index}`}
                  className="w-full h-32 object-cover rounded-md"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-2 right-2 text-white bg-red-500 rounded-full px-2"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <p className="mt-2 text-gray-600">
            You can upload up to <strong>10 images</strong>.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4"
        >
          {isLoading ? "Adding..." : "Add Car"}
        </button>
      </form>
    </div>
  );
};

export default AddCar;
