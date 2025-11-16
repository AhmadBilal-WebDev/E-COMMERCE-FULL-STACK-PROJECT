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

      // Attach Delete event
      const deleteBtn = div.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", () => deleteProduct(product._id));

      // Attach Edit event
      const editBtn = div.querySelector(".edit-btn");
      editBtn.addEventListener("click", () => editProduct(product._id));

      productsContainer.appendChild(div);
    });
  } catch (err) {
    console.error(err);
    productsContainer.innerHTML = "<p>Failed to load products</p>";
  }
}

// DELETE PRODUCT
async function deleteProduct(id) {
  const confirmDelete = confirm("Are you sure you want to delete this product?");
  if (!confirmDelete) return;

  try {
    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
    });
    fetchProducts(); // Refresh products
  } catch (err) {
    console.error(err);
    alert("Failed to delete product");
  }
}

// EDIT PRODUCT
function editProduct(id) {
  // Redirect to adminEditPage with query param
  window.location.href = `adminEditPage.html?id=${id}`;
}

// Initial fetch
fetchProducts();
