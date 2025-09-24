// ./assets/js/addbooking.js
// Combined: dynamic property dropdown + booking submit
const API_BASE = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "http://localhost:5000"
  : "https://cleaning-system-backend-3.onrender.com";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "./login.html";
    return;
  }

  // Populate property select
  const propertySelect = document.getElementById("property");
  if (propertySelect) {
    try {
      const res = await fetch(`${API_BASE}/api/properties`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        console.error("Failed to fetch properties:", res.status, await res.text());
        propertySelect.innerHTML = `<option value="">-- Could not load properties --</option>`;
      } else {
        const properties = await res.json();
        // keep single placeholder
        propertySelect.innerHTML = `<option value="">-- Select Property --</option>`;
        properties.forEach(p => {
          const opt = document.createElement("option");
          opt.value = p._id; // property id for backend
          // label fallback: name || title || address-like fallback
          opt.textContent = p.name || p.title || `${p.location || ""}`.trim() || "Property";
          propertySelect.appendChild(opt);
        });
      }
    } catch (err) {
      console.error("Error loading properties:", err);
      propertySelect.innerHTML = `<option value="">-- Error loading properties --</option>`;
    }
  }

  // Attach form submit handler (prefer form with id "bookingForm", fallback to first <form>)
  const bookingForm = document.getElementById("bookingForm") || document.querySelector("form");
  if (!bookingForm) {
    console.error("Booking form not found on the page.");
    return;
  }

  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const guestName = (document.getElementById("guest")?.value || "").trim();
    const guestEmail = (document.getElementById("email")?.value || "").trim();
    const propertyId = document.getElementById("property")?.value;
    const checkInDate = document.getElementById("checkin")?.value;
    const checkOutDate = document.getElementById("checkout")?.value;
    const status = document.getElementById("status")?.value || "Pending";

    // Minimal validation
    if (!propertyId) { alert("Please select a property."); return; }
    if (!guestName || !guestEmail) { alert("Please enter guest name and email."); return; }
    if (!checkInDate || !checkOutDate) { alert("Please select check-in and check-out dates."); return; }
    if (new Date(checkInDate) >= new Date(checkOutDate)) { alert("Check-out must be after check-in."); return; }

    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId,
          guestName,
          guestEmail,
          checkInDate,
          checkOutDate,
          status
        })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        alert("Booking created successfully!");
        window.location.href = "./bookings.html";
      } else {
        console.error("Create booking failed:", res.status, data);
        alert(data.message || "Failed to create booking");
      }
    } catch (err) {
      console.error("Error connecting to server:", err);
      alert("Error connecting to server. Check console for details.");
    }
  });
});
