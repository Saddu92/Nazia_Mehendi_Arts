import streamifier from "streamifier";

import cloudinary from "../config/cloudinary.js";
import Design from "../models/Design.js";

// Upload image to Cloudinary
function uploadToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "nazia-mehendi/designs",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
}

// Create design
export async function createDesign(req, res) {
  try {
    const { title, category, description, isFeatured } = req.body;

    if (!title || !category || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Title, category and image are required",
      });
    }

    const uploadResult = await uploadToCloudinary(req.file.buffer);

    const design = await Design.create({
      title: title.trim(),
      category,
      description: description || "",
      isFeatured: isFeatured === "true",
      imageUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
    });

    return res.status(201).json({
      success: true,
      message: "Design uploaded successfully",
      design,
    });
  } catch (error) {
    console.error("Create design error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to upload design",
    });
  }
}

// Get all designs
export async function getDesigns(req, res) {
  try {
    const designs = await Design.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: designs.length,
      designs,
    });
  } catch (error) {
    console.error("Get designs error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch designs",
    });
  }
}

// Delete design
export async function deleteDesign(req, res) {
  try {
    const { id } = req.params;

    const design = await Design.findById(id);

    if (!design) {
      return res.status(404).json({
        success: false,
        message: "Design not found",
      });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(design.cloudinaryPublicId);

    // Delete design from MongoDB
    await Design.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Design deleted successfully",
    });
  } catch (error) {
    console.error("Delete design error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete design",
    });
  }
}