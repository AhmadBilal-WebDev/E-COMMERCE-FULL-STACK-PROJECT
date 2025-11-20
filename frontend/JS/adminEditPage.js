const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

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

const editForm = document.getElementById("editProductForm");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");
const descInput = document.getElementById("description");
const cancelBtn = document.getElementById("cancelEdit");

async function fetchProduct() {
  try {
    const res = await fetch(`http://localhost:5000/api/products/${productId}`);
    const product = await res.json();

    nameInput.value = product.name;
    priceInput.value = product.price;
    imageInput.value = product.image;
    descInput.value = product.description || "";
  } catch (err) {
    console.error(err);
    alert("Failed to load product details");
  }
}

fetchProduct();

editForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameInput.value,
        price: priceInput.value,
        image: imageInput.value,
        description: descInput.value,
      }),
    });

    if (res.ok) {
      alert("Product updated successfully!");
      window.location.href = "adminHomePage.html"; // Redirect to home
    } else {
      alert("Failed to update product");
    }
  } catch (err) {
    console.error(err);
    alert("Error updating product");
  }
});

cancelBtn.addEventListener("click", () => {
  window.location.href = "adminHomePage.html";
});
