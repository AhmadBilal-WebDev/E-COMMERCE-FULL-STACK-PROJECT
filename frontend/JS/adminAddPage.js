const productsContainer = document.getElementById("productsContainer");

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


const addForm = document.getElementById("addProductForm");

addForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const image = document.getElementById("image").value;
  const description = document.getElementById("description").value;

  try {
    const res = await fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, image, description }),
    });

    if (res.ok) {
      alert("Product added successfully!");
      addForm.reset();
      window.location.href = "adminHomePage.html";
    } else {
      alert("Failed to add product");
    }
  } catch (err) {
    console.error(err);
    alert("Error adding product");
  }
});

// Delete product
async function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
      });
      fetchProducts(); // refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  }
}

// Edit product
function editProduct(id) {
  window.location.href = `adminEditPage.html?id=${id}`;
}

fetchProducts();
