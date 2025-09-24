const API_BASE = "https://cleaning-system-backend-3.onrender.com";
const token = localStorage.getItem("token");

// Redirect if no token
if (!token) {
  window.location.href = "./login.html";
}

const decoded = jwt_decode(token);

// Fetch wrapper with JWT
async function fetchWithAuth(url) {
  const res = await fetch(url, {
    headers: { Authorization: "Bearer " + token }
  });
  return res.json();
}

// Normalize helper (handles array or object responses)
function normalizeResponse(data, key) {
  if (Array.isArray(data)) return data;
  if (data[key]) return data[key];
  if (data.data) return data.data;
  return []; // fallback
}

async function loadDashboard() {
  try {
    // Call backend APIs
    const [bookingsRaw, propertiesRaw, locksRaw, notificationsRaw] = await Promise.all([
      fetchWithAuth(`${API_BASE}/api/bookings`),
      fetchWithAuth(`${API_BASE}/api/properties`),
      fetchWithAuth(`${API_BASE}/api/locks`),
      fetchWithAuth(`${API_BASE}/api/notifications`)
    ]);

    // Debug logs
    console.log("Bookings raw:", bookingsRaw);
    console.log("Properties raw:", propertiesRaw);
    console.log("Locks raw:", locksRaw);
    console.log("Notifications raw:", notificationsRaw);

    // Normalize data
    const bookings = normalizeResponse(bookingsRaw, "bookings");
    const properties = normalizeResponse(propertiesRaw, "properties");
    const locks = normalizeResponse(locksRaw, "locks");
    const notifications = normalizeResponse(notificationsRaw, "notifications");

    // --- Update stat cards ---
    document.getElementById("bookingCount").textContent = `${bookings.length} Active`;
    document.getElementById("propertyCount").textContent = `${properties.length} Listed`;
    document.getElementById("lockCount").textContent = `${locks.length} Active`;
    document.getElementById("notificationCount").textContent =
      `${notifications.filter(n => !n.read).length} Unread`;

    // --- Update notification badge ---
    const badge = document.getElementById("notificationBadge");
    const unread = notifications.filter(n => !n.read).length;
    badge.style.display = unread > 0 ? "inline-block" : "none";
    badge.textContent = unread;

    // --- Populate activity table ---
    const activityTable = document.getElementById("activityTable");
    activityTable.innerHTML = "";

    const activities = [];

    bookings.slice(-2).forEach(b => {
      activities.push({
        date: new Date(b.createdAt).toLocaleDateString(),
        event: "New Booking",
        details: `${b.guest?.name || "Unknown"} booked ${b.property?.name || "a property"}`
      });
    });

    locks.slice(-2).forEach(l => {
      activities.push({
        date: new Date(l.createdAt).toLocaleDateString(),
        event: "Lock Created",
        details: `Lock code ${l.code}`
      });
    });

    notifications.slice(-2).forEach(n => {
      activities.push({
        date: new Date(n.createdAt).toLocaleDateString(),
        event: "Notification",
        details: n.message
      });
    });

    if (activities.length === 0) {
      activityTable.innerHTML = `<tr><td colspan="3">No recent activity</td></tr>`;
    } else {
      activities.reverse().forEach(a => {
        activityTable.innerHTML += `
          <tr>
            <td>${a.date}</td>
            <td>${a.event}</td>
            <td>${a.details}</td>
          </tr>`;
      });
    }

  } catch (err) {
    console.error("Error loading dashboard:", err);
  }
}

// Run
loadDashboard();
