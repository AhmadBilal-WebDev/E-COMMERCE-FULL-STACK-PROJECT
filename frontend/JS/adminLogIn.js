const form = document.getElementById("adminLoginForm");
const loader = document.getElementById("loader");
const messageEl = document.getElementById("message");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageEl.innerText = "";

  const payload = {
    username: document.getElementById("username").value.trim(),
    password: document.getElementById("password").value,
    secretCode: document.getElementById("secretCode").value,
  };

  try {
    const res = await fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      loader.style.display = "block";
      setTimeout(() => {
        loader.style.display = "none";
        localStorage.setItem("admin", JSON.stringify(data.data));
        window.location.href = "adminHomePage.html";
      }, 1500);
    } else {
      messageEl.style.color = "red";
      messageEl.innerText = data.message || "Login failed";
    }
  } catch (err) {
    console.error(err);
    messageEl.style.color = "red";
    messageEl.innerText = "Server error";
  }
});
