// userDashboard.js

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

const userId = user?.id || user?._id || localStorage.getItem("userId");
const userEmail = user?.email || localStorage.getItem("userEmail");
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

// ---------- NAV to Orders ----------
document.getElementById("viewOrdersBtn").addEventListener("click", () => {
  window.location.href = "userOrders.html";
});

// ---------- PRODUCTS FETCH & RENDER ----------
const productsContainer = document.getElementById("userProductsContainer");

async function getProducts() {
  try {
    const res = await fetch("http://localhost:5000/api/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    console.error("Failed to fetch products:", err);
    productsContainer.innerHTML =
      '<p style="grid-column:1/-1; text-align:center;">Failed to load products.</p>';
  }
}

function renderProducts(products) {
  productsContainer.innerHTML = "";
  if (!products || products.length === 0) {
    productsContainer.innerHTML =
      "<p style='grid-column:1/-1; text-align:center;'>No products found.</p>";
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

// ---------- POPUP HANDLING ----------
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

  // reset quantity & size
  quantity = 1;
  quantityDisplay.innerText = quantity;
  const radios = document.querySelectorAll('input[name="size"]');
  radios.forEach((r) => (r.checked = false));

  popup.style.display = "flex";
  popup.setAttribute("aria-hidden", "false");
}

closePopupBtn.addEventListener("click", () => {
  popup.style.display = "none";
  popup.setAttribute("aria-hidden", "true");
});

// ---------- QUANTITY HANDLING ----------
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

// ---------- ADD TO CART ----------
addToCartBtn.addEventListener("click", async () => {
  if (!currentProduct) return;

  const selectedSize =
    document.querySelector('input[name="size"]:checked')?.value || "N/A";

  const orderPayload = {
    username: username,
    userId: userId,
    productId: currentProduct._id,
    productName: currentProduct.name,
    image: currentProduct.image,
    size: selectedSize,
    quantity: quantity,
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
    console.error("Add to cart error:", err);
    alert("Failed to add order. Try again.");
  } finally {
    addToCartBtn.disabled = false;
    addToCartBtn.innerText = "Add to Cart";
  }
});

// ---------- CLOSE POPUP ON OUTSIDE CLICK ----------
popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.style.display = "none";
    popup.setAttribute("aria-hidden", "true");
  }
});

// ---------- INITIAL FETCH ----------
getProducts();
