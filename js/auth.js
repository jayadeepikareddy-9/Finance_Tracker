/* ======================
   SIGNUP
====================== */
function signup() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.some(u => u.email === email)) {
    alert("Email already registered");
    return;
  }

  const role = email === "admin@gmail.com" ? "admin" : "user";

  users.push({ name, email, password, role });
  localStorage.setItem("users", JSON.stringify(users));

  // ✅ SAVE REGISTRATION TO EXCEL (THIS IS THE KEY)
  fetch("https://script.google.com/macros/s/AKfycbyv9992iBZQ5_8Dmcx3yLzC5slgKHmcxG70-qlNgm5n1hzktirkE9r9GGM-Im6AODS5NQ/exec", {
    method: "POST",
    body: new URLSearchParams({
      name: name,
      email: email,
      role: role
    })
  });

  alert("Registration Successful!");
  window.location.href = "login.html";
}


/* ======================
   LOGIN
====================== */
function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    alert("Invalid credentials");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  window.location.href = "dashboard.html";
}

/* ======================
   TOGGLE PASSWORD
====================== */
function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}
