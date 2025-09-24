 document.getElementById("registerForm").addEventListener("submit", async function(e) {
    e.preventDefault(); // stop default page reload

    // Collect form data
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("https://cleaning-system-backend-3.onrender.com/api/users/register", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, role, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful ✅");
        window.location.href = "login.html"; // redirect after success
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong, try again later.");
    }
  });