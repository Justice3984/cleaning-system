// ================== DASHBOARD WITH ROLE CHECK ================== //
const API_BASE = "https://cleaning-system-backend-3.onrender.com";
const token = localStorage.getItem("token");

if (!token) {
  // No login, redirect
  window.location.href = "./login.html";
} else {
  // Decode token
  const decoded = jwt_decode(token);
  console.log("User info:", decoded);

  // Allow only known roles
  if (["admin", "staff", "host"].includes(decoded.role)) {
    // ✅ Load dashboard data
    loadDashboard(decoded);
  } else {
    alert("Role not recognized!");
    localStorage.removeItem("token");
    window.location.href = "./login.html";
  }
}

// Helper: fetch with Authorization header
async function fetchWithAuth(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
      ...(options.headers || {})
    }
  });
}

// Main dashboard loader
async function loadDashboard(user) {
  try {
    const [bookingsRes, propertiesRes, locksRes, notificationsRes] = await Promise.all([
      fetchWithAuth(`${API_BASE}/api/bookings`),
      fetchWithAuth(`${API_BASE}/api/properties`),
      fetchWithAuth(`${API_BASE}/api/locks`),
      fetchWithAuth(`${API_BASE}/api/notifications`)
    ]);

    const [bookings, properties, locks, notifications] = await Promise.all([
      bookingsRes.json(),
      propertiesRes.json(),
      locksRes.json(),
      notificationsRes.json()
    ]);

    // === Filter data based on role (optional) ===
    let filteredBookings = bookings;
    let filteredProperties = properties;

    if (user.role === "host") {
      // Example: only show host’s own properties/bookings
      filteredBookings = bookings.filter(b => b.hostId === user.id);
      filteredProperties = properties.filter(p => p.hostId === user.id);
    }

    // === Update stat cards ===
    document.querySelector(".cards .card:nth-child(1) p").textContent =
      `${filteredBookings.length} Active`;
    document.querySelector(".cards .card:nth-child(2) p").textContent =
      `${filteredProperties.length} Listed`;
    document.querySelector(".cards .card:nth-child(3) p").textContent =
      `${locks.length} Active`;
    document.querySelector(".cards .card:nth-child(4) p").textContent =
      `${notifications.filter(n => !n.read).length} Unread`;

    // === Notification badge ===
    const badge = document.getElementById("notificationBadge");
    const unread = notifications.filter(n => !n.read).length;
    if (unread > 0) {
      badge.textContent = unread;
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }

    // === Recent Activity ===
    const activity = [];

    filteredBookings.slice(-3).forEach(b => {
      activity.push({
        date: new Date(b.createdAt).toLocaleDateString(),
        event: "New Booking",
        details: `${b.guest?.name || "Unknown"} booked ${b.property?.title || "a property"}`
      });
    });

    locks.slice(-2).forEach(l => {
      activity.push({
        date: new Date(l.createdAt).toLocaleDateString(),
        event: "Lock Created",
        details: `Lock code ${l.code}`
      });
    });

    notifications.slice(-2).forEach(n => {
      activity.push({
        date: new Date(n.createdAt).toLocaleDateString(),
        event: "Notification",
        details: n.message
      });
    });

    // Render activity table
    const tbody = document.querySelector(".overview table tbody");
    tbody.innerHTML = "";
    activity.slice(-5).reverse().forEach(a => {
      tbody.innerHTML += `
        <tr>
          <td>${a.date}</td>
          <td>${a.event}</td>
          <td>${a.details}</td>
        </tr>`;
    });

  } catch (err) {
    console.error("Error loading dashboard:", err);
  }
}
