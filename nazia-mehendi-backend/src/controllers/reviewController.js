import Review from "../models/Review.js";

// ==========================================
// CREATE REVIEW (PUBLIC)
// ==========================================

export async function createReview(req, res) {
  try {
    const { customerName, rating, comment } = req.body;

    if (!customerName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Name, rating and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const review = await Review.create({
      customerName: customerName.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      isApproved: false,
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted for approval",
      review: {
        id: review._id,
        customerName: review.customerName,
        rating: review.rating,
        comment: review.comment,
        isApproved: review.isApproved,
      },
    });
  } catch (error) {
    console.error("Create review error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to submit review",
    });
  }
}

// ==========================================
// GET APPROVED REVIEWS (PUBLIC)
// ==========================================

export async function getApprovedReviews(req, res) {
  try {
    const reviews = await Review.find({
      isApproved: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
}

// ==========================================
// GET ALL REVIEWS (ADMIN)
// ==========================================

export async function getAllReviews(req, res) {
  try {
    const reviews = await Review.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get all reviews error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch all reviews",
    });
  }
}

// ==========================================
// APPROVE REVIEW (ADMIN)
// ==========================================

export async function approveReview(req, res) {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(
      id,
      {
        isApproved: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review approved successfully",
      review,
    });
  } catch (error) {
    console.error("Approve review error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to approve review",
    });
  }
}

// ==========================================
// DELETE REVIEW (ADMIN)
// ==========================================

export async function deleteReview(req, res) {
  try {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
}