// ================== DASHBOARD LOGIC ================== //
const API_BASE = "https://cleaning-system-backend-3.onrender.com";
const token = localStorage.getItem("token");

// redirect if no token
if (!token) {
  window.location.href = "./login.html";
}

// helper to call backend with auth
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

// load dashboard stats
async function loadDashboard() {
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

    // update stats cards
    document.querySelector(".cards .card:nth-child(1) p").textContent =
      `${bookings.length} Active`;
    document.querySelector(".cards .card:nth-child(2) p").textContent =
      `${properties.length} Listed`;
    document.querySelector(".cards .card:nth-child(3) p").textContent =
      `${locks.length} Active`;
    document.querySelector(".cards .card:nth-child(4) p").textContent =
      `${notifications.filter(n => !n.read).length} Unread`;

    // update notification badge
    const badge = document.getElementById("notificationBadge");
    const unread = notifications.filter(n => !n.read).length;
    if (unread > 0) {
      badge.textContent = unread;
      badge.style.display = "inline-block";
    } else {
      badge.style.display = "none";
    }

    // recent activity (show latest 5 from bookings + notifications + locks)
    const activity = [];

    bookings.slice(-3).forEach(b => {
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

    // render activity table
    const tbody = document.querySelector(".overview table tbody");
    tbody.innerHTML = "";
    activity.slice(-5).reverse().forEach(a => {
      const row = `<tr>
        <td>${a.date}</td>
        <td>${a.event}</td>
        <td>${a.details}</td>
      </tr>`;
      tbody.innerHTML += row;
    });

  } catch (err) {
    console.error("Error loading dashboard:", err);
  }
}

// run on page load
loadDashboard();
