
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Send,
  X,
} from "lucide-react";

import SectionHeading from "./SectionHeading";
import { reviews as staticReviews } from "../data/content";
import { apiUrl } from "../lib/api";

const REVIEWS_API_URL = apiUrl("reviews");

export default function Reviews() {
  const [reviews, setReviews] = useState(staticReviews);
  const [active, setActive] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    rating: 0,
    comment: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch approved reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(REVIEWS_API_URL);
        const data = await response.json();

        if (!response.ok) return;

        const backendReviews = data.reviews || data;

        setReviews([...staticReviews, ...backendReviews]);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  // Handle form input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  // Submit review
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    // Frontend validation
    if (
      !form.customerName.trim() ||
      !form.comment.trim() ||
      !form.rating
    ) {
      setError("Please fill in your name, rating and review.");
      return;
    }

    if (form.rating < 1 || form.rating > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(REVIEWS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: form.customerName.trim(),
          rating: form.rating,
          comment: form.comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit review");
      }

      setMessage(
        "Thank you! Your review will appear after approval."
      );

      // Reset form
      setForm({
        customerName: "",
        rating: 5,
        comment: "",
      });
    } catch (error) {
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Close popup
  const closeForm = () => {
    setShowForm(false);
    setMessage("");
    setError("");
  };

  return (
    <section
      id="reviews"
      className="section-padding bg-[#f8f4ed]"
    >
      <div className="container-shell">
        {/* Heading and Controls */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Client stories"
            title="Words That Inspire"
          />

          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {/* Write Review Button */}
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="rounded-full bg-[#30452d] px-4 py-3 text-xs text-white transition hover:bg-[#425c3e]"
            >
              + Write a Review
            </button>

            {/* Previous Button */}
            <button
              type="button"
              aria-label="Previous review"
              disabled={reviews.length <= 1}
              onClick={() =>
                setActive(
                  (active - 1 + reviews.length) % reviews.length
                )
              }
              className="grid h-9 w-9 place-items-center rounded-full border border-[#cfc6b6] transition hover:bg-[#efe7da] disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>

            {/* Next Button */}
            <button
              type="button"
              aria-label="Next review"
              disabled={reviews.length <= 1}
              onClick={() =>
                setActive((active + 1) % reviews.length)
              }
              className="grid h-9 w-9 place-items-center rounded-full border border-[#cfc6b6] transition hover:bg-[#efe7da] disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>

            {/* Counter */}
            <span className="ml-1 text-[11px]">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(reviews.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Reviews */}
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.map((review, index) => {
            const customerName =
              review.customerName || review.name || "Customer";

            const comment = review.comment || review.text || "";

            return (
              <article
                key={review._id || `${customerName}-${index}`}
                className={`rounded-xl border border-[#ded5c8] p-6 transition ${
                  index === active
                    ? "-translate-y-1 bg-[#efe7da]"
                    : "hidden md:block"
                }`}
              >
                {/* Initials */}
                <div className="grid h-14 w-14 place-items-center rounded-full bg-[#bca58c] font-display text-xl text-white">
                  {customerName
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                {/* Review Text */}
                <p className="my-5 font-display text-sm leading-7">
                  “{comment}”
                </p>

                {/* Stars */}
                <div className="mb-4 flex gap-1 text-[#c17d45]">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      size={12}
                      fill={
                        starIndex < (review.rating || 5)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  ))}
                </div>

                {/* Name */}
                <strong className="block text-xs">
                  {customerName}
                </strong>

                {/* Type */}
                <span className="mt-1 block text-[10px] text-[#94887b]">
                  {review.type || "Customer"}
                </span>
              </article>
            );
          })}
        </div>
      </div>

      {/* Review Popup */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
          onClick={closeForm}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-[#fffaf3] p-6 shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={closeForm}
              aria-label="Close review form"
              className="absolute right-4 top-4 rounded-full p-1 text-[#6a4432] transition hover:bg-[#efe7da]"
            >
              <X size={20} />
            </button>

            {/* Heading */}
            <p className="text-xs uppercase tracking-[0.2em] text-[#a07850]">
              Share your experience
            </p>

            <h3 className="mt-2 font-display text-3xl text-[#30452d]">
              Add Your Review
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#81766a]">
              We would love to hear about your mehendi experience.
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="review-name"
                  className="mb-2 block text-xs text-[#62594f]"
                >
                  Your Name
                </label>

                <input
                  id="review-name"
                  type="text"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-xl border border-[#d9cdbd] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[#6a4432]"
                />
              </div>

              {/* Rating */}
              <div>
                <p className="mb-2 text-xs text-[#62594f]">
                  Your Rating
                </p>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      aria-label={`${rating} stars`}
                      onClick={() =>
                        setForm((previous) => ({
                          ...previous,
                          rating,
                        }))
                      }
                      className="transition hover:scale-110"
                    >
                      <Star
                        size={24}
                        fill={
                          rating <= form.rating
                            ? "#c17d45"
                            : "transparent"
                        }
                        className="text-[#c17d45]"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label
                  htmlFor="review-comment"
                  className="mb-2 block text-xs text-[#62594f]"
                >
                  Your Review
                </label>

                <textarea
                  id="review-comment"
                  name="comment"
                  value={form.comment}
                  onChange={handleChange}
                  placeholder="Write your experience..."
                  rows={4}
                  required
                  className="w-full resize-none rounded-xl border border-[#d9cdbd] bg-transparent px-4 py-3 text-sm outline-none transition focus:border-[#6a4432]"
                />
              </div>

              {/* Success Message */}
              {message && (
                <p className="rounded-lg bg-[#e5eddf] p-3 text-xs text-[#30452d]">
                  {message}
                </p>
              )}

              {/* Error Message */}
              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#30452d] px-5 py-3 text-sm text-white transition hover:bg-[#425c3e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting..." : "Submit Review"}
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
