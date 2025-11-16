// ===== Redirect logged-in users away from signup page =====
if (localStorage.getItem("user")) {
  window.location.href = "userDashboard.html";
}

// ===== Sign-up form =====
const signupForm = document.querySelector(".signup-form");
let message = document.createElement("p");
message.id = "message";
message.style.marginTop = "10px";
signupForm.appendChild(message);

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    password: document.getElementById("password").value,
  };

  try {
    const res = await fetch("http://localhost:5000/api/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      message.style.color = "green";
      message.innerText = data.message;
      signupForm.reset();

      // Optional: Auto-redirect to login after successful signup
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);

    } else {
      message.style.color = "red";
      message.innerText = data.message;
    }
  } catch (err) {
    message.style.color = "red";
    message.innerText = "Something went wrong!";
    console.error(err);
  }
});
