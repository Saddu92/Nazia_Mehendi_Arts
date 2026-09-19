import { apiUrl } from "../lib/api";

const API_URL = apiUrl("bookings");

export async function submitBooking(bookingData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Booking submission failed");
  }

  return data;
}
