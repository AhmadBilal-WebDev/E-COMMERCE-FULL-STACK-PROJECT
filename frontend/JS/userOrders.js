// ---------- AUTH CHECK ----------
const userData = localStorage.getItem("user");
let user = null;

if (userData) {
  try {
    user = JSON.parse(userData);
  } catch (e) {
    user = null;
  }
}

const username =
  user?.name || localStorage.getItem("username") || user?.username;

// ---------- LOGOUT ----------
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
  localStorage.removeItem("userToken");
  localStorage.removeItem("username");
  localStorage.removeItem("userEmail");
  window.location.href = "logIn.html";
});

// ---------- FETCH & RENDER USER ORDERS ----------
const ordersContainer = document.getElementById("ordersContainer");

async function getUserOrders() {
  if (!username) {
    ordersContainer.innerHTML =
      "<p style='text-align:center;'>No user found. Please login.</p>";
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:5000/api/orders/get?username=${encodeURIComponent(
        username
      )}`
    );
    if (!res.ok) throw new Error("Failed to fetch orders");
    const orders = await res.json();
    renderOrders(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    ordersContainer.innerHTML =
      "<p style='text-align:center;'>Failed to load orders.</p>";
  }
}

function renderOrders(orders) {
  ordersContainer.innerHTML = "";

  if (!orders || orders.length === 0) {
    ordersContainer.innerHTML =
      "<p style='text-align:center;'>You have no orders yet.</p>";
    return;
  }

  orders.forEach((order) => {
    const div = document.createElement("div");
    div.classList.add("order-card");

    div.innerHTML = `
      <img src="${order.image || "https://via.placeholder.com/150"}" alt="${order.productName}" />
      <div class="order-details">
        <h4>${order.productName}</h4>
        <p>Size: ${order.size || "N/A"}</p>
        <p>Quantity: ${order.quantity || 1}</p>
        <p>Price: $${Number((order.price || 0) * (order.quantity || 1)).toFixed(2)}</p>
        <span class="order-status ${order.status?.toLowerCase() || "pending"}">
          ${order.status || "Pending"}
        </span>
      </div>
      <button class="cancel-btn" data-id="${order._id}">Cancel</button>
    `;

    ordersContainer.appendChild(div);
  });

  // Cancel button functionality
  document.querySelectorAll(".cancel-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const orderId = e.target.dataset.id;
      if (confirm("Are you sure you want to cancel this order?")) {
        try {
          const res = await fetch(
            `http://localhost:5000/api/orders/delete/${orderId}`,
            { method: "DELETE" }
          );
          const data = await res.json();
          if (data.success) {
            alert("Order cancelled successfully!");
            getUserOrders();
          } else {
            alert("Failed to cancel order.");
          }
        } catch (err) {
          console.error("Cancel order error:", err);
          alert("Failed to cancel order. Try again.");
        }
      }
    });
  });
}


// ---------- INITIAL FETCH ----------
getUserOrders();
