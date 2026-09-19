import mongoose from "mongoose";

const designSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Bridal",
        "Arabic",
        "Minimal",
        "Engagement",
        "Traditional",
        "Other",
      ],
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    imageUrl: {
      type: String,
      required: true,
    },

    cloudinaryPublicId: {
      type: String,
      required: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Design = mongoose.model("Design", designSchema);

export default Design;