const form = document.getElementById("contactForm");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(form);

  fetch("https://script.google.com/macros/s/AKfycbzCkCw08l0ffarrRXFt5zllNQckDaUbrAAqzMltxrzvcaxC4zUbt4fsecw3i7NjtkA7/exec", {
    method: "POST",
    body: formData
  })
  .then(res => res.text())
  .then(() => {
    const popup = document.getElementById("successPopup");
    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
    }, 3000);

    form.reset();
  })
  .catch(() => {
    alert("❌ Message failed. Please try again.");
  });
});
