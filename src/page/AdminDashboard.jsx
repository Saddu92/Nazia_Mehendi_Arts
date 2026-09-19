
import { useEffect, useState } from "react";
import {
  Upload,
  LogOut,
  ImagePlus,
  Trash2,
  Check,
  Star,
  MessageSquare,
  CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../lib/api";

const API_URL = apiUrl();

export default function AdminDashboard() {
  const navigate = useNavigate();

  // ==========================
  // UPLOAD FORM
  // ==========================

  const [form, setForm] = useState({
    title: "",
    category: "Bridal",
    description: "",
    isFeatured: false,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ==========================
  // DESIGNS
  // ==========================

  const [designs, setDesigns] = useState([]);
  const [designsLoading, setDesignsLoading] = useState(true);
  const [deletingDesignId, setDeletingDesignId] = useState(null);

  // ==========================
  // REVIEWS
  // ==========================

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [approvingReviewId, setApprovingReviewId] = useState(null);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  // ==========================
  // BOOKINGS
  // ==========================

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);
  const [deletingBookingId, setDeletingBookingId] = useState(null);

  // ==========================
  // INITIAL DATA FETCH
  // ==========================

  useEffect(() => {
    fetchDesigns();
    fetchReviews();
    fetchBookings();
  }, []);

  // ==========================
  // FORM HANDLERS
  // ==========================

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleImageChange(event) {
    const selectedImage = event.target.files[0];

    if (!selectedImage) return;

    const maxSize = 10 * 1024 * 1024;

    if (selectedImage.size > maxSize) {
      setMessage("Image size must be less than 10 MB.");
      return;
    }

    setImage(selectedImage);
    setPreview(URL.createObjectURL(selectedImage));
    setMessage("");
  }

  // ==========================
  // DESIGN FUNCTIONS
  // ==========================

  async function fetchDesigns() {
    try {
      setDesignsLoading(true);

      const response = await fetch(`${API_URL}/designs`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch designs");
      }

      setDesigns(data.designs || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setDesignsLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!image) {
      setMessage("Please select an image.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("description", form.description);
      formData.append("isFeatured", form.isFeatured);
      formData.append("image", image);

      const response = await fetch(`${API_URL}/designs`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setForm({
        title: "",
        category: "Bridal",
        description: "",
        isFeatured: false,
      });

      setImage(null);
      setPreview("");

      setMessage("Design uploaded successfully! 🌸");

      await fetchDesigns();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteDesign(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this design?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    setDeletingDesignId(id);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/designs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete design");
      }

      setDesigns((previous) =>
        previous.filter((design) => design._id !== id)
      );

      setMessage("Design deleted successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setDeletingDesignId(null);
    }
  }

  // ==========================
  // REVIEW FUNCTIONS
  // ==========================

  async function fetchReviews() {
    try {
      setReviewsLoading(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await fetch(`${API_URL}/reviews/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reviews");
      }

      setReviews(data.reviews || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setReviewsLoading(false);
    }
  }

  async function handleApproveReview(id) {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    setApprovingReviewId(id);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/reviews/${id}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to approve review");
      }

      setReviews((previous) =>
        previous.map((review) =>
          review._id === id
            ? { ...review, isApproved: true }
            : review
        )
      );

      setMessage("Review approved successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setApprovingReviewId(null);
    }
  }

  async function handleDeleteReview(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    setDeletingReviewId(id);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/reviews/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete review");
      }

      setReviews((previous) =>
        previous.filter((review) => review._id !== id)
      );

      setMessage("Review deleted successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setDeletingReviewId(null);
    }
  }

  // ==========================
  // BOOKING FUNCTIONS
  // ==========================

  async function fetchBookings() {
    try {
      setBookingsLoading(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await fetch(`${API_URL}/bookings/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bookings");
      }

      setBookings(data.bookings || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBookingsLoading(false);
    }
  }

  async function handleUpdateBookingStatus(id, status) {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    setUpdatingBookingId(id);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update booking"
        );
      }

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === id ? data.booking : booking
        )
      );

      setMessage("Booking status updated successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUpdatingBookingId(null);
    }
  }

  async function handleDeleteBooking(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin/login");
      return;
    }

    setDeletingBookingId(id);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete booking"
        );
      }

      setBookings((previous) =>
        previous.filter((booking) => booking._id !== id)
      );

      setMessage("Booking deleted successfully.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setDeletingBookingId(null);
    }
  }

  // ==========================
  // LOGOUT
  // ==========================

  function handleLogout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");

    navigate("/admin/login");
  }

  const pendingReviews = reviews.filter(
    (review) => !review.isApproved
  );

  const approvedReviews = reviews.filter(
    (review) => review.isApproved
  );

  // ==========================
  // UI
  // ==========================

  return (
    <main className="min-h-screen bg-cream px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8 flex items-start justify-between gap-4 sm:mb-10 sm:items-center">
          <div>
            <p className="eyebrow">Nazia Mehendi</p>

            <h1 className="display-title text-4xl">
              Admin <em>Dashboard</em>
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-[#746b61] transition hover:text-black"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* MESSAGE */}
        {message && (
          <p className="mb-6 rounded-lg bg-[#f1ebe2] p-3 text-sm text-[#746b61]">
            {message}
          </p>
        )}

        {/* ==========================
            UPLOAD DESIGN
        ========================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl bg-white p-4 shadow-sm sm:p-6"
        >
          <div className="flex items-center gap-2">
            <ImagePlus size={20} />

            <h2 className="text-xl font-medium">
              Upload New Design
            </h2>
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Design Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Elegant Bridal Mehendi"
              required
              className="w-full border-b border-[#b8aa99] bg-transparent p-2 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#b8aa99] bg-transparent p-3"
            >
              <option value="Bridal">Bridal</option>
              <option value="Arabic">Arabic</option>
              <option value="Minimal">Minimal</option>
              <option value="Engagement">Engagement</option>
              <option value="Traditional">Traditional</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe this design..."
              rows={3}
              className="w-full resize-none border-b border-[#b8aa99] p-2 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Design Image
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              required
              className="w-full text-sm"
            />
          </div>

          {preview && (
            <img
              src={preview}
              alt="Design preview"
              className="h-64 w-full rounded-xl object-cover"
            />
          )}

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
            />

            Mark as featured design
          </label>

          <button
            type="submit"
            disabled={loading}
            className="primary-button flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Upload size={16} />

            {loading ? "Uploading..." : "Upload Design"}
          </button>
        </form>

        {/* ==========================
            MANAGE DESIGNS
        ========================== */}

        <section className="mt-8 rounded-2xl bg-white p-4 shadow-sm sm:mt-10 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-medium">
              Manage Designs
            </h2>

            <span className="text-sm text-[#746b61]">
              {designs.length} designs
            </span>
          </div>

          {designsLoading ? (
            <p className="text-sm text-[#746b61]">
              Loading designs...
            </p>
          ) : designs.length === 0 ? (
            <p className="text-sm text-[#746b61]">
              No designs uploaded yet.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {designs.map((design) => (
                <div
                  key={design._id}
                  className="overflow-hidden rounded-xl border border-[#e5ddd3]"
                >
                  <img
                    src={design.imageUrl}
                    alt={design.title}
                    className="h-52 w-full object-cover"
                  />

                  <div className="space-y-3 p-4">
                    <div>
                      <h3 className="font-medium">
                        {design.title}
                      </h3>

                      <p className="text-sm text-[#746b61]">
                        {design.category}
                      </p>

                      {design.isFeatured && (
                        <span className="mt-2 inline-block rounded-full bg-[#f1ebe2] px-3 py-1 text-xs text-[#746b61]">
                          Featured
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteDesign(design._id)
                      }
                      disabled={deletingDesignId === design._id}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                    >
                      <Trash2 size={16} />

                      {deletingDesignId === design._id
                        ? "Deleting..."
                        : "Delete Design"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ==========================
            MANAGE REVIEWS
        ========================== */}

        <section className="mt-8 rounded-2xl bg-white p-4 shadow-sm sm:mt-10 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={20} />

              <h2 className="text-xl font-medium">
                Manage Reviews
              </h2>
            </div>

            <span className="text-sm text-[#746b61]">
              {reviews.length} reviews
            </span>
          </div>

          {/* REVIEW SUMMARY */}
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-[#f7f2eb] p-4">
              <p className="text-sm text-[#746b61]">
                Total Reviews
              </p>

              <p className="mt-1 text-2xl font-medium">
                {reviews.length}
              </p>
            </div>

            <div className="rounded-xl bg-[#f7f2eb] p-4">
              <p className="text-sm text-[#746b61]">
                Pending
              </p>

              <p className="mt-1 text-2xl font-medium">
                {pendingReviews.length}
              </p>
            </div>

            <div className="rounded-xl bg-[#f7f2eb] p-4">
              <p className="text-sm text-[#746b61]">
                Approved
              </p>

              <p className="mt-1 text-2xl font-medium">
                {approvedReviews.length}
              </p>
            </div>
          </div>

          {reviewsLoading ? (
            <p className="text-sm text-[#746b61]">
              Loading reviews...
            </p>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-[#746b61]">
              No reviews available.
            </p>
          ) : (
            <div className="space-y-5">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-xl border border-[#e5ddd3] p-4"
                >
                  {/* REVIEW HEADER */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-medium">
                        {review.customerName}
                      </h3>

                      <div className="mt-1 flex items-center gap-1">
                        {Array.from({ length: 5 }).map(
                          (_, index) => (
                            <Star
                              key={index}
                              size={15}
                              className={
                                index < review.rating
                                  ? "fill-[#b38a45] text-[#b38a45]"
                                  : "text-[#d5c9bb]"
                              }
                            />
                          )
                        )}

                        <span className="ml-1 text-xs text-[#746b61]">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        review.isApproved
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {review.isApproved
                        ? "Approved"
                        : "Pending"}
                    </span>
                  </div>

                  {/* COMMENT */}
                  <p className="mt-4 text-sm leading-6 text-[#746b61]">
                    {review.comment}
                  </p>

                  {/* ACTIONS */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {!review.isApproved && (
                      <button
                        type="button"
                        onClick={() =>
                          handleApproveReview(review._id)
                        }
                        disabled={
                          approvingReviewId === review._id
                        }
                        className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700 transition hover:bg-green-100 disabled:opacity-50"
                      >
                        <Check size={16} />

                        {approvingReviewId === review._id
                          ? "Approving..."
                          : "Approve Review"}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteReview(review._id)
                      }
                      disabled={
                        deletingReviewId === review._id
                      }
                      className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                    >
                      <Trash2 size={16} />

                      {deletingReviewId === review._id
                        ? "Deleting..."
                        : "Delete Review"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ==========================
            MANAGE BOOKINGS
        ========================== */}

        <section className="mt-8 rounded-2xl bg-white p-4 shadow-sm sm:mt-10 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays size={20} />

              <h2 className="text-xl font-medium">
                Booking Management
              </h2>
            </div>

            <span className="text-sm text-[#746b61]">
              {bookings.length} bookings
            </span>
          </div>

          {bookingsLoading ? (
            <p className="text-sm text-[#746b61]">
              Loading bookings...
            </p>
          ) : bookings.length === 0 ? (
            <p className="text-sm text-[#746b61]">
              No bookings available.
            </p>
          ) : (
            <div className="space-y-5">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="rounded-xl border border-[#e5ddd3] p-5"
                >
                  {/* BOOKING HEADER */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-medium">
                        {booking.customerName}
                      </h3>

                      <p className="text-sm text-[#746b61]">
                        {booking.phone}
                      </p>

                      {booking.email && (
                        <p className="text-sm text-[#746b61]">
                          {booking.email}
                        </p>
                      )}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        booking.status === "Confirmed"
                          ? "bg-green-50 text-green-700"
                          : booking.status === "Completed"
                          ? "bg-blue-50 text-blue-700"
                          : booking.status === "Cancelled"
                          ? "bg-red-50 text-red-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {booking.status || "Pending"}
                    </span>
                  </div>

                  {/* BOOKING DETAILS */}
                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-[#746b61]">
                        Event Type
                      </p>

                      <p className="font-medium">
                        {booking.eventType || "Other"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[#746b61]">
                        Design
                      </p>

                      <p className="font-medium">
                        {booking.design || "Not selected"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[#746b61]">
                        Event Date
                      </p>

                      <p className="font-medium">
                        {booking.eventDate
                          ? new Date(
                              booking.eventDate
                            ).toLocaleDateString("en-IN")
                          : "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[#746b61]">
                        Event Time
                      </p>

                      <p className="font-medium">
                        {booking.eventTime || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[#746b61]">
                        Location
                      </p>

                      <p className="font-medium">
                        {booking.location || "To be confirmed"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[#746b61]">
                        Guest Count
                      </p>

                      <p className="font-medium">
                        {booking.guestCount || 1}
                      </p>
                    </div>
                  </div>

                  {/* CUSTOMER MESSAGE */}
                  {booking.message && (
                    <div className="mt-4 rounded-lg bg-[#f7f2eb] p-3">
                      <p className="mb-1 text-xs text-[#746b61]">
                        Customer Message
                      </p>

                      <p className="text-sm">
                        {booking.message}
                      </p>
                    </div>
                  )}

                  {/* BOOKING ACTIONS */}
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <select
                      value={booking.status || "Pending"}
                      onChange={(event) =>
                        handleUpdateBookingStatus(
                          booking._id,
                          event.target.value
                        )
                      }
                      disabled={
                        updatingBookingId === booking._id
                      }
                      className="rounded-lg border border-[#b8aa99] bg-white px-3 py-2 text-sm outline-none"
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="Confirmed">
                        Confirmed
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteBooking(booking._id)
                      }
                      disabled={
                        deletingBookingId === booking._id
                      }
                      className="flex items-center justify-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                    >
                      <Trash2 size={16} />

                      {deletingBookingId === booking._id
                        ? "Deleting..."
                        : "Delete Booking"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
