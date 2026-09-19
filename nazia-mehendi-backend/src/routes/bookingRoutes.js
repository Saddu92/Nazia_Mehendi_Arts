import express from "express";

import {
  createBooking,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} from "../controllers/bookingController.js";

import { protectAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route
router.post("/", createBooking);

// Admin-only routes
router.get("/admin", protectAdmin, getAllBookings);

router.patch(
  "/:id/status",
  protectAdmin,
  updateBookingStatus
);

router.delete(
  "/:id",
  protectAdmin,
  deleteBooking
);

export default router;