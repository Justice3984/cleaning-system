document.getElementById("loginForm").addEventListener("submit", async function(e) {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("https://cleaning-system-backend-3.onrender.com/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          // save JWT token in localStorage
          localStorage.setItem("token", data.token);
          window.location.href = "./dashboard.html"; // go to dashboard
        } else {
          alert("❌ " + data.message);
        }
      } catch (err) {
        console.error("Error:", err);
        alert("⚠️ Something went wrong.");
      }
    });