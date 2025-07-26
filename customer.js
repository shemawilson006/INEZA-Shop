let products = JSON.parse(localStorage.getItem('products')) || [];

const welcomeMsg = document.getElementById('welcomeMsg');

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

window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name') || 'Guest';
  welcomeMsg.textContent = `Hello, ${name}! Here are the products you can browse:`;
  renderProducts();
};
