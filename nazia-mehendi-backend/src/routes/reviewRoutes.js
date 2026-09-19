import express from "express";

import {
  createReview,
  getApprovedReviews,
  getAllReviews,
  approveReview,
  deleteReview,
} from "../controllers/reviewController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/", createReview);
router.get("/", getApprovedReviews);

// Admin-only routes
router.get("/admin", protectAdmin, getAllReviews);
router.patch("/:id/approve", protectAdmin, approveReview);
router.delete("/:id", protectAdmin, deleteReview);

export default router;