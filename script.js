// ========================= BOOKINGS ENHANCEMENTS ========================= //

// Load bookings dynamically with "View" button
async function loadBookings() {
  try {
    const res = await fetch(`${API_BASE}/bookings`);
    const data = await res.json();

    const tbody = document.querySelector("#bookingsTable tbody");
    tbody.innerHTML = ""; // clear existing rows

    data.forEach(b => {
      const row = `
        <tr>
          <td>${b.property?.title || "N/A"}</td>
          <td>${b.guest?.name || "N/A"}</td>
          <td>${new Date(b.startDate).toLocaleDateString()}</td>
          <td>${new Date(b.endDate).toLocaleDateString()}</td>
          <td>
            <span class="status ${b.status === "Confirmed" ? "active" : "inactive"}">
              ${b.status || "Pending"}
            </span>
          </td>
          <td>
            <button class="btn small" onclick='openBookingModal(${JSON.stringify(b)})'>🔍 View</button>
          </td>
        </tr>`;
      tbody.innerHTML += row;
    });
  } catch (err) {
    console.error("Error loading bookings:", err);
  }
}

// Open modal with booking details
function openBookingModal(booking) {
  const modal = document.getElementById("bookingModal");
  const details = document.getElementById("bookingDetails");

  details.innerHTML = `
    <p><strong>Guest:</strong> ${booking.guest?.name || "N/A"} (${booking.guest?.email || "N/A"})</p>
    <p><strong>Property:</strong> ${booking.property?.title || "N/A"}</p>
    <p><strong>Check-In:</strong> ${new Date(booking.startDate).toLocaleDateString()}</p>
    <p><strong>Check-Out:</strong> ${new Date(booking.endDate).toLocaleDateString()}</p>
    <p><strong>Status:</strong> 
      <span class="status ${booking.status === "Confirmed" ? "active" : "inactive"}">
        ${booking.status}
      </span>
    </p>
    ${booking.lock ? `<p><strong>Lock Code:</strong> ${booking.lock.code}</p>` : ""}
    <div class="modal-actions">
      <button class="btn small" onclick="confirmBooking('${booking._id}')">✅ Confirm</button>
      <button class="btn small danger" onclick="deleteBooking('${booking._id}')">🗑 Delete</button>
    </div>
  `;

  modal.style.display = "flex";
}

// Close modal
function closeBookingModal() {
  document.getElementById("bookingModal").style.display = "none";
}

// Close modal if clicked outside
window.onclick = function(e) {
  const modal = document.getElementById("bookingModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

// Confirm booking
async function confirmBooking(id) {
  try {
    const res = await fetch(`${API_BASE}/bookings/${id}/confirm`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    alert(data.message || "Booking confirmed!");
    closeBookingModal();
    loadBookings();
  } catch (err) {
    console.error("Error confirming booking:", err);
  }
}

// Delete booking
async function deleteBooking(id) {
  if (!confirm("Are you sure you want to delete this booking?")) return;

  try {
    const res = await fetch(`${API_BASE}/bookings/${id}`, {
      method: "DELETE"
    });
    const data = await res.json();
    alert(data.message || "Booking deleted!");
    closeBookingModal();
    loadBookings();
  } catch (err) {
    console.error("Error deleting booking:", err);
  }
}
