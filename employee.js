let products = JSON.parse(localStorage.getItem('products')) || [];
let sales = JSON.parse(localStorage.getItem('sales')) || [];

const saleForm = document.getElementById('saleForm');
const saleProduct = document.getElementById('saleProduct');
const saleQuantity = document.getElementById('saleQuantity');
const customerNameInput = document.getElementById('customerName');
const paymentMethod = document.getElementById('paymentMethod');
const totalPriceDiv = document.getElementById('totalPrice');
const saleMessage = document.getElementById('saleMessage');

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => {
    p.style.display = p.id === pageId ? 'block' : 'none';
  });
  if(pageId === 'products') renderProducts();
  if(pageId === 'sales') updateTotal();
}

function renderProducts() {
  const tbody = document.querySelector('#productsTable tbody');
  tbody.innerHTML = '';
  products.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.sellingPrice}</td>
      <td>${p.stock}</td>
    `;
    tbody.appendChild(tr);
  });
}

function fillProductSelect() {
  saleProduct.innerHTML = '';
  products.forEach((p,i) => {
    if(p.stock > 0) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `${p.name} (Stock: ${p.stock}) - ${p.sellingPrice} RWF`;
      saleProduct.appendChild(option);
    }
  });
}

function updateTotal() {
  const prodIdx = parseInt(saleProduct.value);
  const qty = parseInt(saleQuantity.value);
  if(isNaN(prodIdx) || isNaN(qty) || qty <= 0) {
    totalPriceDiv.textContent = '';
    return;
  }
  const total = products[prodIdx].sellingPrice * qty;
  totalPriceDiv.textContent = `Total Price: ${total} RWF`;
}

saleProduct.addEventListener('change', updateTotal);
saleQuantity.addEventListener('input', updateTotal);

saleForm.addEventListener('submit', function(e){
  e.preventDefault();

  const prodIdx = parseInt(saleProduct.value);
  const qty = parseInt(saleQuantity.value);
  const custName = customerNameInput.value.trim();
  const payMethod = paymentMethod.value;

  if(isNaN(prodIdx) || qty <= 0 || !custName || !payMethod) {
    saleMessage.textContent = 'Please fill all fields correctly.';
    saleMessage.style.color = 'red';
    return;
  }

  if(qty > products[prodIdx].stock) {
    saleMessage.textContent = 'Not enough stock available.';
    saleMessage.style.color = 'red';
    return;
  }

  // Update stock and sold count
  products[prodIdx].stock -= qty;
  products[prodIdx].sold = (products[prodIdx].sold || 0) + qty;

  // Record sale
  const saleRecord = {
    date: new Date().toISOString(),
    productName: products[prodIdx].name,
    quantity: qty,
    soldBy: getEmployeeName(),
    customerName: custName,
    paymentMethod: payMethod,
    totalPrice: products[prodIdx].sellingPrice * qty,
    costPrice: products[prodIdx].purchasePrice * qty
  };

  sales.push(saleRecord);
  localStorage.setItem('products', JSON.stringify(products));
  localStorage.setItem('sales', JSON.stringify(sales));

  saleMessage.textContent = `Sale recorded successfully! Total: ${saleRecord.totalPrice} RWF`;
  saleMessage.style.color = 'green';

  saleForm.reset();
  fillProductSelect();
  updateTotal();
});

function logout() {
  window.location.href = "index.html";
}

// Get employee username from URL query parameter
function getEmployeeName() {
  const params = new URLSearchParams(window.location.search);
  return params.get('user') || 'Unknown';
}

window.onload = () => {
  fillProductSelect();
  showPage('sales');
};
