
  document.getElementById("propertyForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // stop normal form submission

    const name = document.getElementById("name").value;
    const location = document.getElementById("location").value;
    const host = document.getElementById("host").value;
    const status = document.getElementById("status").value;

    const token = localStorage.getItem("token");
    console.log(" Token in localStorage:", token);

    try {
      const res = await fetch("https://cleaning-system-backend-3.onrender.com/api/properties/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token") // add JWT for auth
        },
        body: JSON.stringify({ name, location, host, status })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Property created successfully!");
        window.location.href = "./properties.html"; // redirect to list page
      } else {
        alert(data.message || "Failed to add property");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  });

