document.addEventListener("DOMContentLoaded", loadBookings);

 const API_BASE = "https://cleaning-system-backend-3.onrender.com";

async function loadBookings() {
  try {
    const response = await fetch(`${API_BASE}/api/bookings`);
    if (!response.ok) throw new Error("Failed to fetch bookings");

    const bookings = await response.json();
    console.log("Loaded Bookings:", bookings);

    const tableBody = document.querySelector("#bookingTable tbody");
    tableBody.innerHTML = ""; // clear existing

    bookings.forEach(b => {
      addBookingRow(b, b.property?.name || "Unknown");
    });
  } catch (error) {
    console.error("Error loading bookings:", error);
  }
}

async function simulateBooking() {
  try {
    const response = await fetch(`${API_BASE}/api/simulate/simulate-booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) throw new Error("Failed to simulate booking");

    const data = await response.json();
    console.log("Simulation Response:", data);

    // Insert simulated booking into table
    addBookingRow(data.booking, data.property);
  } catch (error) {
    console.error("Error simulating booking:", error);
  }
}

function addBookingRow(booking, propertyName) {
  const tableBody = document.querySelector("#bookingTable tbody");

  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${booking.guestName}</td>
    <td>${booking.guestEmail}</td>
    <td>${new Date(booking.checkInDate).toLocaleDateString()}</td>
    <td>${new Date(booking.checkOutDate).toLocaleDateString()}</td>
    <td>${propertyName}</td>
    <td>${booking.status}</td>
  `;

  tableBody.prepend(row); // show latest first
}
