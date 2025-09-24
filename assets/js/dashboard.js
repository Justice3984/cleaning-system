const token = localStorage.getItem("token");

  if (!token) {
    // No login, redirect
    window.location.href = "./login.html";
  } else {
    // Decode token to get role
    const decoded = jwt_decode(token);
    console.log("User info:", decoded);

    // Redirect based on role
    if (decoded.role === "admin") {
      window.location.href = "./dashboard.html";
    } else if (decoded.role === "staff") {
      window.location.href = "./dashboard.html";
    } else if (decoded.role === "host") {
      window.location.href = "./dashboard.html";
    } else {
      alert("Role not recognized!");
      window.location.href = "./login.html";
    }
  }