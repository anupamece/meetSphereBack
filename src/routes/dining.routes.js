import { Router } from "express";
import {
    createDining,
    getAllDining,
    getDiningById,
    updateDining,
    deleteDining
} from "../controllers/dinning.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Routes mapping
router.post("/createDining", verifyJWT, upload.single("image"), createDining);
router.get("/getAllDining", getAllDining);
router.get("/getDiningById/:id", getDiningById);
router.put("/updateDining/:id", verifyJWT, updateDining);
router.delete("/deleteDining/:id", verifyJWT, deleteDining);

export default router;