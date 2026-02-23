if (!localStorage.getItem("currentUser")) {
  window.location.replace("index.html");
}

const ADMIN_EMAIL = "challajayadeepikareddy@gmail.com";
const user = JSON.parse(localStorage.getItem("currentUser"));

/* ======================
   PROTECT DASHBOARD
====================== */
if (!user) {
  window.location.href = "login.html";
}

/* ======================
   WELCOME MESSAGE
====================== */
document.getElementById("welcome").innerText =
  user.role === "admin"
    ? `Welcome Admin, ${user.name}`
    : `Welcome, ${user.name}`;

/* ======================
   ADMIN CONTROLS
====================== */
const adminControls = document.getElementById("admin-controls");
if (user.role === "admin") {
  document.getElementById("admin-controls").style.display = "block";
}


/* ======================
   LOGOUT
====================== */
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}


/* ======================
   TRANSACTIONS STORAGE
====================== */
function getTransactions() {
  return JSON.parse(localStorage.getItem("transactions")) || [];
}

function saveTransactions(data) {
  localStorage.setItem("transactions", JSON.stringify(data));
}

/* ======================
   ADD TRANSACTION
====================== */
function addTransaction() {
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value.trim();
  const amount = Number(document.getElementById("amount").value);
  const date = document.getElementById("date").value;

  if (!category || !amount || !date) {
    alert("Please fill all fields");
    return;
  }

  const data = getTransactions();
  data.push({ type, category, amount, date });
  saveTransactions(data);

  // Clear inputs
  document.getElementById("category").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("date").value = "";

  updateDashboard();
}

/* ======================
   DASHBOARD CALCULATIONS
====================== */
let barChart = null;
let pieChart = null;

function updateDashboard() {
  const data = getTransactions();
  let income = 0;
  let expense = 0;
  const categories = {};

  data.forEach(t => {
    if (t.type === "income") {
      income += t.amount;
    } else {
      expense += t.amount;
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    }
  });

  document.getElementById("totalIncome").innerText = `₹${income}`;
  document.getElementById("totalExpense").innerText = `₹${expense}`;
  document.getElementById("balance").innerText = `₹${income - expense}`;

  drawCharts(income, expense, categories);
}

/* ======================
   CHARTS
====================== */
function drawCharts(income, expense, categories) {
  const barCtx = document.getElementById("incomeExpenseChart");
  const pieCtx = document.getElementById("categoryChart");

  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  /* BAR CHART */
  barChart = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        label: "Amount",
        data: [income, expense],
        backgroundColor: ["#22c55e", "#ef4444"]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  });

  /* PIE CHART */
  const labels = Object.keys(categories);
  const values = Object.values(categories);

  if (labels.length === 0) {
    pieChart = new Chart(pieCtx, {
      type: "pie",
      data: {
        labels: ["No Expense Data"],
        datasets: [{
          data: [1],
          backgroundColor: ["#e5e7eb"]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    });
    return;
  }

  pieChart = new Chart(pieCtx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: [
          "#4b7bec",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#14b8a6"
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

/* ======================
   ADMIN EXPORT
====================== */
function exportUsersToExcel() {
  if (user.role !== "admin") return;

  const users = JSON.parse(localStorage.getItem("users")) || [];
  let csv = "Name,Email\n";

  users.forEach(u => {
    csv += `${u.name},${u.email}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "registrations.csv";
  link.click();
}

/* ======================
   INIT
====================== */
updateDashboard();
