 const API_BASE = "https://cleaning-system-backend-3.onrender.com"; // adjust to your backend

async function updateNotificationBadge() {
  try {
    if (!token) return;

    const res = await fetch(`${API_BASE}/api/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    const badge = document.getElementById("notificationBadge");

    if (badge) {
      if (data.count > 0) {
        badge.textContent = data.count;
        badge.style.display = "inline-block";
      } else {
        badge.textContent = "";
        badge.style.display = "none";
      }
    }
  } catch (err) {
    console.error("Error updating notification badge:", err);
  }
}

// Run immediately and refresh every 30 seconds
updateNotificationBadge();
setInterval(updateNotificationBadge, 30000);
