import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    eventType: {
      type: String,
      enum: [
        "Bridal",
        "Engagement",
        "Party",
        "Festival",
        "Baby Shower",
        "Other",
      ],
      default: "Other",
    },

    // Preferred mehendi design
    design: {
      type: String,
      trim: true,
      default: "",
      maxlength: 100,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    eventTime: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      default: "To be confirmed",
      trim: true,
    },

    guestCount: {
      type: Number,
      min: 1,
      default: 1,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;