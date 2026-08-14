// Access Protection
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("isAdmin") !== "true") {
    window.location.href = "admin-signin.html";
  }

  // Logout Script
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("isAdmin");
      window.location.href = "admin-signin.html";
    });
  }
});
