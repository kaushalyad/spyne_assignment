const express = require("express");
const {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
} = require("../controllers/carController");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");

const upload = multer({ dest: "uploads/" }); // Multer configuration for file uploads

// Define the routes
router.post("/", authMiddleware, upload.array('images', 10), createCar); // POST route for creating car with image upload
router.get("/", authMiddleware, getCars); // GET route to fetch all cars
router.get("/:id", authMiddleware, getCarById); // GET route for a specific car by ID
router.put("/:id", authMiddleware, upload.array('images', 10), updateCar); // PUT route for updating car with image upload
router.delete("/:id", authMiddleware, deleteCar); // DELETE route for deleting car

module.exports = router;
