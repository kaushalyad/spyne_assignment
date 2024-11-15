const cloudinary = require("cloudinary").v2; // Cloudinary for image uploads
const fs = require("fs"); // File system operations
const jwt = require("jsonwebtoken");
const Car = require("../models/Car"); // Assuming Car model is defined

// Cloudinary configuration
cloudinary.config({
  cloud_name: "sweet-home-online-store",
  api_key: "867847492482959",
  api_secret: "aFXLJlW_UdKVNzH2I6DETg24PM0",
});

// Helper function to delete images locally after upload
const deleteLocalFiles = (files) => {
  files.forEach((file) => {
    fs.unlink(file, (err) => {
      if (err) console.error("Error deleting local file:", err);
    });
  });
};

// Create a new car
const createCar = async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    // Extract userId from the authorization token
    const token = req.headers.authorization.split(" ")[1]; // Assuming Bearer token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT_SECRET
    const userId = decoded.userId; // Get the userId from the decoded token
    
    if (!userId) {
      return res.status(400).json({ message: "User not authenticated" });
    }

    // Handle file uploads using multer
    const imagePaths = req.files.map((file) => file.path); // Assuming you're using multer for file handling

    // Upload images to Cloudinary
    const imageUrls = await Promise.all(
      imagePaths.map(async (filePath) => {
        const result = await cloudinary.uploader.upload(filePath);
        return result.secure_url; // Return the secure URL of the uploaded image
      })
    );

    // Create a new car entry
    const newCar = new Car({
      title,
      description,
      tags,
      images: imageUrls, // Store URLs of the uploaded images
      userId,
    });

    await newCar.save();
    deleteLocalFiles(imagePaths); // Clean up local files after upload

    res.status(201).json({ message: "Car added successfully", data: newCar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding car", error: err.message });
  }
};

// Get all cars for the logged-in user
const getCars = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const cars = await Car.find({ userId: userId });
    res.json(cars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch cars." });
  }
};

// Get a specific car by ID
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ error: "Car not found." });
    }
    res.json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch car." });
  }
};

// Update a car's details
const updateCar = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const car = await Car.findById(req.params.id);

    if (!car || car.userId.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ error: "Car not found or unauthorized access." });
    }

    let imageUrls = car.images; // Preserve old images if no new ones are uploaded
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => file.path);

      // Upload new images to Cloudinary
      const updatedImages = await Promise.all(
        images.map(async (image) => {
          const result = await cloudinary.uploader.upload(image);
          return result.secure_url;
        })
      );

      deleteLocalFiles(images); // Clean up local files
      imageUrls = updatedImages; // Replace with new images
    }

    car.title = title || car.title;
    car.description = description || car.description;
    car.tags = tags || car.tags;
    car.images = imageUrls;

    await car.save();
    res.json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update car." });
  }
};

// Delete a car
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car || car.userId.toString() !== req.user._id.toString()) {
      return res
        .status(404)
        .json({ error: "Car not found or unauthorized access." });
    }

    // Delete images from Cloudinary
    await Promise.all(
      car.images.map(async (url) => {
        const publicId = url.split("/").pop().split(".")[0]; // Extract public ID from URL
        await cloudinary.uploader.destroy(publicId);
      })
    );

    await car.remove();
    res.json({ message: "Car deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete car." });
  }
};

module.exports = {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
};
