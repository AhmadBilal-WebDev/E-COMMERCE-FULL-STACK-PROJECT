document.getElementById("homeBtn").addEventListener("click", () => {
  window.location.href = "adminHomePage.html";
});

document.getElementById("addBtn").addEventListener("click", () => {
  window.location.href = "adminAddPage.html";
});

document.getElementById("ordersBtn").addEventListener("click", () => {
  window.location.href = "adminOrderPage.html";
});

function goHome() {
  window.location.href = "userDashboard.html";
}

function goOrders() {
  window.location.href = "userOrder.html";
}

