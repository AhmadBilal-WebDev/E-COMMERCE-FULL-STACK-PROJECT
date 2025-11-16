// ===== Protect Page =====
const userData = localStorage.getItem("user");
if (!userData) {
  window.location.href = "logIn.html";
}

const user = JSON.parse(userData);

// ===== Header Username =====
const usernameDisplay = document.getElementById("usernameDisplay");
usernameDisplay.innerText = `Hello, ${user.name || user.email}`;

// ===== Logout =====
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("user");
    window.location.href = "logIn.html";
  }
});

// ===== Products Container =====
const productsContainer = document.getElementById("userProductsContainer");

// ===== Loader =====
const loader = document.createElement("div");
loader.className = "loader";
loader.innerHTML = `<div class="spinner"></div>`;
productsContainer.appendChild(loader);

// ===== Fetch Products =====
async function fetchProducts() {
  loader.style.display = "block";
  try {
    const res = await fetch("http://localhost:5000/api/products");
    const products = await res.json();

    loader.style.display = "none";
    productsContainer.innerHTML = "";

    if (products.length === 0) {
      productsContainer.innerHTML = "<p>No products available</p>";
      return;
    }

    products.forEach((product) => {
      const div = document.createElement("div");
      div.classList.add("product-card");

      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h4>${product.name}</h4>
        <p>${product.description || ""}</p>
        <span class="price-tag">$${product.price}</span>
      `;

      productsContainer.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    loader.style.display = "none";
    productsContainer.innerHTML = "<p>Failed to load products</p>";
  }
}

// ===== Initial Fetch =====
fetchProducts();
