// ===== AUTH CHECK =====
const adminData = localStorage.getItem("admin");
if (!adminData) {
  window.location.href = "adminLogin.html";
}

// ===== LOGOUT =====
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;
    localStorage.removeItem("admin");
    window.location.href = "adminLogin.html";
  });
}

// ===== FETCH PRODUCTS =====
const productsContainer = document.getElementById("productsContainer");

async function fetchProducts() {
  try {
    const res = await fetch("http://localhost:5000/api/products");
    const products = await res.json();

    productsContainer.innerHTML = "";

    products.forEach((product) => {
      const div = document.createElement("div");
      div.classList.add("product-card");

      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h4>${product.name}</h4>
        <p>${product.description || ""}</p>
        <span class="price-tag">$${product.price}</span>
        <div class="product-buttons">
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </div>
      `;

      div
        .querySelector(".delete-btn")
        .addEventListener("click", () => deleteProduct(product._id));
      div
        .querySelector(".edit-btn")
        .addEventListener("click", () => editProduct(product._id));

      productsContainer.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    productsContainer.innerHTML = "<p>Failed to load products</p>";
  }
}

async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;
  try {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  } catch (err) {
    console.error(err);
    alert("Failed to delete product");
  }
}

function editProduct(id) {
  window.location.href = `adminEditPage.html?id=${id}`;
}

fetchProducts();
