const userData = localStorage.getItem("user");
let user = null;

if (userData) {
  try {
    user = JSON.parse(userData);
  } catch {
    user = null;
  }
}

const userId = user?._id || user?.id || localStorage.getItem("userId");
const username =
  user?.name || user?.username || localStorage.getItem("username");

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("user");
  localStorage.removeItem("userId");
  localStorage.removeItem("userToken");
  localStorage.removeItem("username");
  window.location.href = "logIn.html";
});

// NAV TO ORDERS
document.getElementById("viewOrdersBtn").addEventListener("click", () => {
  window.location.href = "userOrders.html";
});

const productsContainer = document.getElementById("userProductsContainer");
const searchInput = document.getElementById("searchInput");
let allProducts = [];

// FETCH PRODUCTS
async function getProducts() {
  try {
    const res = await fetch("http://localhost:5000/api/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    allProducts = await res.json();
    renderProducts(allProducts);
  } catch (err) {
    console.error(err);
    productsContainer.innerHTML =
      '<p style="grid-column:1/-1; text-align:center;">Failed to load products.</p>';
  }
}

// RENDER PRODUCTS
function renderProducts(products) {
  productsContainer.innerHTML = "";
  if (!products.length) {
    productsContainer.innerHTML =
      '<p style="grid-column:1/-1; text-align:center;">No products found.</p>';
    return;
  }

  products.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("product-card");

    div.innerHTML = `
      <img src="${
        p.image || "https://via.placeholder.com/300x200"
      }" alt="${escapeHtml(p.name)}" />
      <h3>${escapeHtml(p.name)}</h3>
      <p>${escapeHtml(p.description || "")}</p>
      <strong>$${Number(p.price).toFixed(2)}</strong>
    `;

    div.addEventListener("click", () => openPopup(p));
    productsContainer.appendChild(div);
  });
}

// ESCAPE HTML
function escapeHtml(text) {
  if (!text) return "";
  return String(text).replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[m])
  );
}

// SEARCH PRODUCTS
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();
  const filtered = allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query))
  );
  renderProducts(filtered);
});

// POPUP HANDLING
const popup = document.getElementById("productPopup");
const popupImage = document.getElementById("popupImage");
const popupName = document.getElementById("popupName");
const popupDesc = document.getElementById("popupDesc");
const popupPrice = document.getElementById("popupPrice");
const quantityDisplay = document.getElementById("quantityDisplay");
const increaseQtyBtn = document.getElementById("increaseQty");
const decreaseQtyBtn = document.getElementById("decreaseQty");
const addToCartBtn = document.getElementById("addToCartBtn");
const closePopupBtn = document.getElementById("closePopup");

let quantity = 1;
let currentProduct = null;

function openPopup(product) {
  currentProduct = product;
  popupImage.src = product.image || "https://via.placeholder.com/600x400";
  popupName.innerText = product.name;
  popupDesc.innerText = product.description || "";
  popupPrice.innerText = "$" + Number(product.price).toFixed(2);

  quantity = 1;
  quantityDisplay.innerText = quantity;
  document
    .querySelectorAll('input[name="size"]')
    .forEach((r) => (r.checked = false));

  popup.style.display = "flex";
  popup.setAttribute("aria-hidden", "false");
}

closePopupBtn.addEventListener("click", () => {
  popup.style.display = "none";
  popup.setAttribute("aria-hidden", "true");
});

popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.style.display = "none";
    popup.setAttribute("aria-hidden", "true");
  }
});

// QUANTITY HANDLING
increaseQtyBtn.addEventListener("click", () => {
  quantity++;
  quantityDisplay.innerText = quantity;
});
decreaseQtyBtn.addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;
    quantityDisplay.innerText = quantity;
  }
});

// ADD TO CART
addToCartBtn.addEventListener("click", async () => {
  if (!currentProduct) return;

  const selectedSize =
    document.querySelector('input[name="size"]:checked')?.value || "N/A";

  const orderPayload = {
    username,
    userId,
    productId: currentProduct._id,
    productName: currentProduct.name,
    image: currentProduct.image,
    size: selectedSize,
    quantity,
    price: currentProduct.price,
    status: "Pending",
  };

  try {
    addToCartBtn.disabled = true;
    addToCartBtn.innerText = "Adding...";

    const res = await fetch("http://localhost:5000/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    const data = await res.json();

    if (data.success) {
      alert("Order added successfully!");
      popup.style.display = "none";
      window.location.href = "userOrders.html";
    } else {
      alert("Failed to add order.");
    }
  } catch (err) {
    console.error(err);
    alert("Failed to add order. Try again.");
  } finally {
    addToCartBtn.disabled = false;
    addToCartBtn.innerText = "Add to Cart";
  }
});

// INITIAL FETCH
getProducts();
