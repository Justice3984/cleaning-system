const API_BASE = "https://cleaning-system-backend-3.onrender.com";

//  Populate property dropdown on page load
document.addEventListener("DOMContentLoaded", async function () {
  const propertySelect = document.getElementById("property");

  try {
    const res = await fetch(`${API_BASE}/api/properties`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
      }
    });

    const data = await res.json();

    if (res.ok) {
      data.forEach(prop => {
        const option = document.createElement("option");
        option.value = prop._id; // backend should send property _id
        option.textContent = prop.name; // show property name
        propertySelect.appendChild(option);
      });
    } else {
      console.error("Failed to load properties:", data.message);
      alert("Could not load properties. Please try again.");
    }
  } catch (err) {
    console.error("Error fetching properties:", err);
    alert("Error connecting to server while loading properties.");
  }
});

// ✅ Booking form submission
document.getElementById("bookingForm").addEventListener("submit", async function (e) {
  e.preventDefault(); // stop normal form submission

  const guest = document.getElementById("guest").value;
  const email = document.getElementById("email").value;
  const property = document.getElementById("property").value;
  const checkin = document.getElementById("checkin").value;
  const checkout = document.getElementById("checkout").value;
  const status = document.getElementById("status").value;

  try {
    const res = await fetch(`${API_BASE}/api/bookings/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token") // include JWT
      },
      body: JSON.stringify({ guest, email, property, checkin, checkout, status })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Booking created successfully!");
      window.location.href = "./bookings.html"; // redirect back to bookings list
    } else {
      alert(data.message || "Failed to create booking");
    }
  } catch (err) {
    console.error(err);
    alert("Error connecting to server");
  }
});
