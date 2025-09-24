
  document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/api/locks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const locks = await res.json();

      const tbody = document.getElementById("locksTableBody");
      tbody.innerHTML = "";

      locks.forEach(lock => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${lock.code}</td>
          <td>${lock.property?.name || "N/A"}</td>
          <td>${lock.status}</td>
          <td>${lock.validFrom ? new Date(lock.validFrom).toISOString().split("T")[0] : "-"}</td>
          <td>${lock.validTo ? new Date(lock.validTo).toISOString().split("T")[0] : "-"}</td>
        `;
        tbody.appendChild(tr);
      });
    } catch (err) {
      console.error("Error loading locks:", err);
    }
  });

