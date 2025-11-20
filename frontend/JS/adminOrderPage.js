// ===== AUTH CHECK =====
const adminData = localStorage.getItem("admin");
if (!adminData) {
  // Agar admin login nahi hai → redirect login page
  window.location.href = "adminLogin.html";
}

// ===== LOGOUT =====
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    // Clear admin session
    localStorage.removeItem("admin");

    // Redirect to login
    window.location.href = "adminLogin.html";
  });
}

const ordersTableBody = document.getElementById("ordersTableBody");

async function fetchOrders() {
  try {
    const res = await fetch("http://localhost:5000/api/orders/get");
    const orders = await res.json();

    ordersTableBody.innerHTML = "";

    orders.forEach((order, index) => {
      const tr = document.createElement("tr");

      // Set row color based on status
      const bgColor =
        order.status === "Accepted" || order.status === "Rejected"
          ? "#d3d3d3" // light gray
          : "#ffffff"; // white

      tr.style.backgroundColor = bgColor;

      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${order.username}</td>
        <td>${order.email}</td>
        <td>${order.phone}</td>
        <td>${order.productName}</td>
        <td>${order.size}</td>
        <td>${order.price}</td>
        <td id="status-${order._id}">${order.status}</td>
        <td>
          <button class="accept-btn" data-id="${order._id}" ${
        order.status === "Accepted" ? "disabled" : ""
      }>Accept</button>
          <button class="reject-btn" data-id="${order._id}" ${
        order.status === "Rejected" ? "disabled" : ""
      }>Reject</button>
        </td>
      `;

      ordersTableBody.appendChild(tr);
    });

    addStatusEventListeners();
  } catch (err) {
    console.error("Failed to fetch orders:", err);
  }
}

// ===== Accept / Reject Buttons =====
function addStatusEventListeners() {
  document.querySelectorAll(".accept-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      updateOrderStatus(btn.dataset.id, "Accepted")
    );
  });

  document.querySelectorAll(".reject-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      updateOrderStatus(btn.dataset.id, "Rejected")
    );
  });
}

async function updateOrderStatus(orderId, status) {
  try {
    const res = await fetch(
      `http://localhost:5000/api/orders/update/${orderId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );

    const data = await res.json();
    if (data.success) {
      // Update status cell
      const statusCell = document.getElementById(`status-${orderId}`);
      statusCell.innerText = status;

      // Update row color
      const row = document
        .querySelector(`button[data-id='${orderId}']`)
        .closest("tr");
      if (status === "Accepted" || status === "Rejected") {
        row.style.backgroundColor = "#d3d3d3"; // gray
      } else {
        row.style.backgroundColor = "#ffffff"; // white
      }

      // Disable buttons accordingly
      if (status === "Accepted") {
        row.querySelector(".accept-btn").disabled = true;
        row.querySelector(".reject-btn").disabled = false;
      } else if (status === "Rejected") {
        row.querySelector(".reject-btn").disabled = true;
        row.querySelector(".accept-btn").disabled = false;
      }
    }
  } catch (err) {
    console.error("Failed to update order status:", err);
  }
}

// ===== Initial fetch =====
window.addEventListener("DOMContentLoaded", fetchOrders);
