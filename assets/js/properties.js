
  document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("tbody");

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        window.location.href = "index.html";
        return;
      }

      // Fetch properties from backend
      const res = await fetch("https://cleaning-system-backend-3.onrender.com/api/properties", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Failed to fetch properties");
      const properties = await res.json();

      // Clear old static rows
      tableBody.innerHTML = "";

      // Populate rows dynamically
      properties.forEach((property, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${property._id}</td>
          <td>${property.name}</td>
          <td>${property.location}</td>
          <td>${property.host?.name || "N/A"}</td>
          <td>
            <span class="status ${property.status === "active" ? "active" : "inactive"}">
              ${property.status}
            </span>
          </td>
          <td>${property.bookings ? property.bookings.length : 0}</td>
          <td><a href="property-details.html?id=${property._id}">View</a></td>
        `;

        tableBody.appendChild(tr);
      });

    } catch (err) {
      console.error(err);
      tableBody.innerHTML = `<tr><td colspan="7">Error loading properties</td></tr>`;
    }
  });

