import Booking from "../models/Booking.js";

// ==========================================
// CREATE BOOKING + WHATSAPP LINK
// ==========================================

export async function createBooking(req, res) {
  try {
    const {
      customerName,
      phone,
      email,
      eventType,
      design,
      eventDate,
      eventTime,
      location,
      guestCount,
      message,
    } = req.body;

    // Required field validation
    if (!customerName || !phone || !eventDate) {
      return res.status(400).json({
        success: false,
        message: "Name, phone number, and event date are required",
      });
    }

    const parsedDate = new Date(eventDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid event date",
      });
    }

    // Prevent past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (parsedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Event date cannot be in the past",
      });
    }

    const booking = await Booking.create({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email || "",
      eventType: eventType || "Other",
      design: design || "",
      eventDate: parsedDate,
      eventTime: eventTime || "",
      location: location || "To be confirmed",
      guestCount: guestCount || 1,
      message: message || "",
    });

    const whatsappNumber = process.env.WHATSAPP_NUMBER;

    const whatsappMessage = `Hello Nazia! 🌸

I would like to enquire about mehendi booking.

Name: ${booking.customerName}
Phone: ${booking.phone}
Preferred Date: ${booking.eventDate.toLocaleDateString("en-IN")}
Event Type: ${booking.eventType}
Design: ${booking.design || "Not selected"}
Location: ${booking.location}
Guest Count: ${booking.guestCount}

Message:
${booking.message || "I would like to know about availability and pricing."}

Thank you!`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    return res.status(201).json({
      success: true,
      message: "Booking enquiry submitted successfully",
      booking,
      whatsappUrl,
    });
  } catch (error) {
    console.error("Create booking error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to submit booking enquiry",
    });
  }
}

// ==========================================
// GET ALL BOOKINGS (ADMIN)
// ==========================================

export async function getAllBookings(req, res) {
  try {
    const bookings = await Booking.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
}

// ==========================================
// UPDATE BOOKING STATUS (ADMIN)
// ==========================================

export async function updateBookingStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Completed",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Update booking status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to update booking status",
    });
  }
}

// ==========================================
// DELETE BOOKING (ADMIN)
// ==========================================

export async function deleteBooking(req, res) {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Delete booking error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete booking",
    });
  }
}