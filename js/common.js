const user = JSON.parse(localStorage.getItem("currentUser"));

// Pages that do NOT require login
const publicPages = [
  "index.html",
  "about.html",
  "services.html",
  "testimonials.html",
  "contact.html",
  "login.html",
  "signup.html"
];

// Get current page name
const currentPage = location.pathname.split("/").pop();

// Protect ONLY dashboard
if (!user && !publicPages.includes(currentPage)) {
  window.location.href = "login.html";
}
