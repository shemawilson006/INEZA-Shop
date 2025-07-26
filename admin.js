let products = JSON.parse(localStorage.getItem('products')) || [];
let sales = JSON.parse(localStorage.getItem('sales')) || [];

document.getElementById('productForm').addEventListener('submit', function(e){
  e.preventDefault();
  saveProduct();
});

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => {
    p.style.display = p.id === pageId ? 'block' : 'none';
  });
  if(pageId === 'dashboard') renderDashboard();
  if(pageId === 'products') renderProducts();
}

function renderDashboard() {
  const summaryDiv = document.getElementById('summary');
  let totalStock = 0, totalSold = 0, totalProfit = 0;
  products.forEach(p => {
    totalStock += p.stock;
    totalSold += p.sold || 0;
    totalProfit += ((p.sellingPrice - p.purchasePrice) * (p.sold || 0));
  });
  summaryDiv.innerHTML = `
    <p><b>Total Stock:</b> ${totalStock}</p>
    <p><b>Total Sold:</b> ${totalSold}</p>
    <p><b>Total Profit:</b> ${totalProfit.toFixed(2)} RWF</p>
  `;

  const tbody = document.querySelector('#salesTable tbody');
  tbody.innerHTML = '';
  sales.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(s.date).toLocaleString()}</td>
      <td>${s.productName}</td>
      <td>${s.quantity}</td>
      <td>${(s.totalPrice - s.costPrice).toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderProducts() {
  const tbody = document.querySelector('#productsTable tbody');
  tbody.innerHTML = '';
  products.forEach((p,i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.purchasePrice}</td>
      <td>${p.sellingPrice}</td>
      <td>${p.stock}</td>
      <td>
        <button onclick="editProduct(${i})">Edit</button>
        <button onclick="deleteProduct(${i})">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function saveProduct() {
  const name = document.getElementById('productName').value.trim();
  const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
  const sellingPrice = parseFloat(document.getElementById('sellingPrice').value);
  const stock = parseInt(document.getElementById('stock').value);
  const editIndex = document.getElementById('editIndex').value;

  if(!name || isNaN(purchasePrice) || isNaN(sellingPrice) || isNaN(stock)) {
    alert('Please fill all fields correctly');
    return;
  }
  if(sellingPrice < purchasePrice) {
    alert('Selling price must be greater or equal to purchase price');
    return;
  }

  if(editIndex === '') {
    products.push({name, purchasePrice, sellingPrice, stock, sold:0});
  } else {
    products[editIndex] = { ...products[editIndex], name, purchasePrice, sellingPrice, stock };
  }
  localStorage.setItem('products', JSON.stringify(products));
  document.getElementById('productForm').reset();
  document.getElementById('editIndex').value = '';
  renderProducts();
  alert('Product saved successfully!');
}

function editProduct(i) {
  const p = products[i];
  document.getElementById('productName').value = p.name;
  document.getElementById('purchasePrice').value = p.purchasePrice;
  document.getElementById('sellingPrice').value = p.sellingPrice;
  document.getElementById('stock').value = p.stock;
  document.getElementById('editIndex').value = i;
  showPage('products');
}

function deleteProduct(i) {
  if(confirm('Delete this product?')) {
    products.splice(i,1);
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
  }
}

function logout() {
  window.location.href = "index.html";
}

window.onload = () => {
  showPage('dashboard');
};
