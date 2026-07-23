import Dining from "../models/dining.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// @desc    Create a new dining spot with image upload
// @route   POST /api/dining/createDining
export const createDining = async (req, res) => {
    try {
        const { name, description, location, price } = req.body;
        const imageFile = req.file;

        if (!name || !description || !location || !price) {
            return res.status(400).json({ message: "Missing required text fields" });
        }

        if (!imageFile) {
            return res.status(400).json({ message: "Dining image is required" });
        }

        // Upload local file to Cloudinary
        const uploadedImage = await uploadOnCloudinary(imageFile.path);
        if (!uploadedImage) {
            return res.status(500).json({ message: "Image upload to Cloudinary failed" });
        }

        const newDining = await Dining.create({
            organizer: req.user._id, // Assuming you have user authentication and the user ID is available in req.user
            name,
            description,
            location,
            price: Number(price),
            image: uploadedImage.secure_url
        });

        return res.status(201).json({ 
            message: "Dining created successfully", 
            dining: newDining 
        });

    } catch (error) {
        console.error("Error in createDining:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get all dining spots
// @route   GET /api/dining/getAllDining
export const getAllDining = async (req, res) => {
    try {
        const diningSpots = await Dining.find({});
        return res.status(200).json({ dining: diningSpots });
    } catch (error) {
        console.error("Error in getAllDining:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Get a single dining spot by ID
// @route   GET /api/dining/getDiningById/:id
export const getDiningById = async (req, res) => {
    try {
        const { id } = req.params;
        const diningSpot = await Dining.findById(id);

        if (!diningSpot) {
            return res.status(404).json({ message: "Dining spot not found" });
        }

        return res.status(200).json({ dining: diningSpot });
    } catch (error) {
        console.error("Error in getDiningById:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Update a dining spot
// @route   PUT /api/dining/updateDining/:id
export const updateDining = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, location, price, image } = req.body;

        const updatedDining = await Dining.findByIdAndUpdate(
            id,
            { name, description, location, price, image },
            { new: true, runValidators: true }
        );

        if (!updatedDining) {
            return res.status(404).json({ message: "Dining spot not found" });
        }

        return res.status(200).json({ 
            message: "Dining updated successfully", 
            dining: updatedDining 
        });
    } catch (error) {
        console.error("Error in updateDining:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// @desc    Delete a dining spot
// @route   DELETE /api/dining/deleteDining/:id
export const deleteDining = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDining = await Dining.findByIdAndDelete(id);

        if (!deletedDining) {
            return res.status(404).json({ message: "Dining spot not found" });
        }

        return res.status(200).json({ message: "Dining spot deleted successfully" });
    } catch (error) {
        console.error("Error in deleteDining:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
