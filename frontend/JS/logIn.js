// ===== Redirect logged-in users away from login page =====
if (localStorage.getItem("user")) {
  window.location.href = "userDashboard.html";
}

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const loader = document.getElementById("loader");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  loader.classList.remove("hidden"); // show loader

  const payload = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const res = await fetch("http://localhost:5000/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      message.style.color = "green";
      message.innerText = data.message;

      // Save login state
      localStorage.setItem("user", JSON.stringify(data.data));

      setTimeout(() => {
        loader.classList.add("hidden");
        window.location.href = "userDashboard.html";
      }, 1000);

    } else {
      loader.classList.add("hidden");
      message.style.color = "red";
      message.innerText = data.message;
    }

  } catch (err) {
    loader.classList.add("hidden");
    message.style.color = "red";
    message.innerText = "Something went wrong!";
  }
});
