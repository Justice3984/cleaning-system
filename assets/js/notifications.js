 const API_BASE = "https://cleaning-system-backend-3.onrender.com"; // change to your backend URL
const token = localStorage.getItem("token");  // your JWT token from login

// Load all notifications
async function loadNotifications() {
  try {
    const res = await fetch(`${API_BASE}/api/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch notifications");

    const notifications = await res.json();
    const tbody = document.getElementById("notificationTableBody");
    tbody.innerHTML = ""; // clear old rows

    notifications.forEach(n => {
      const tr = document.createElement("tr");
      const date = new Date(n.createdAt).toLocaleDateString();
      const status = n.read ? "Read" : "Unread";

      tr.innerHTML = `
        <td>${date}</td>
        <td>${n.message}</td>
        <td>${n.type}</td>
        <td>${status}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error loading notifications:", err);
  }
}

// Load unread notification count and update badge
async function updateUnreadCount() {
  try {
    const res = await fetch(`${API_BASE}/api/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch unread count");

    const data = await res.json();
    const badge = document.querySelector(".sidebar nav a[href='notifications.html'] .badge");

    if (badge) {
      badge.textContent = data.count;
      // Hide badge if no unread
      badge.style.display = data.count > 0 ? "inline-block" : "none";
    }
  } catch (err) {
    console.error("Error fetching unread count:", err);
  }
}

// Run on page load
document.addEventListener("DOMContentLoaded", () => {
  loadNotifications();
  updateUnreadCount();

  // Auto refresh every 10s so it stays live
  setInterval(() => {
    loadNotifications();
    updateUnreadCount();
  }, 10000);
});
