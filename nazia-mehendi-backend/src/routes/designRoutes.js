import express from "express";

import {
  createDesign,
  getDesigns,
  deleteDesign,
} from "../controllers/designController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public route
router.get("/", getDesigns);

// Admin-only route
router.post(
  "/",
  protectAdmin,
  upload.single("image"),
  createDesign
);

// Admin-only route
router.delete("/:id", protectAdmin, deleteDesign);

export default router;