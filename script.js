 const products = [
    { id: 1, name: 'Wireless Headphones', price: 199, image: 'images/headphones.jpg', category: 'audio' },
    { id: 2, name: 'Smart Watch', price: 299, image: 'images/watch.jpg', category: 'wearables' },
    { id: 3, name: 'Bluetooth Speaker', price: 129, image: 'images/bt.jpg', category: 'audio' },
    { id: 4, name: '4K Camera', price: 799, image: 'images/cam.jpg', category: 'photography' },
    { id: 5, name: 'Gaming Mouse', price: 59, image: 'images/mouse.jpg', category: 'accessories' },
    { id: 6, name: 'Mechanical Keyboard', price: 89, image: 'images/keyboard.jpg', category: 'accessories' },
    { id: 7, name: 'Smart Phone', price: 500, image: 'images/phone.jpg', category: 'accessories' },
    { id: 8, name: 'Laptop', price: 670, image: 'images/laptop.jpg', category: 'accessories' },
];

let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderProducts();
    loadTheme();
    updateCart();
});

function renderCategories() {
    const categories = ['all', 'audio', 'wearables', 'photography', 'accessories'];
    const container = document.getElementById('categories');
    container.innerHTML = categories.map(cat => `
        <button class="category-btn ${localStorage.getItem('activeCategory') === cat ? 'active' : ''}" 
                onclick="filterProducts('${cat}')">
            ${cat.charAt(0).toUpperCase() + cat.slice(1)}
        </button>
    `).join('');
}

function filterProducts(category) {
    localStorage.setItem('activeCategory', category);
    renderCategories();
    renderProducts(category === 'all' ? products : products.filter(p => p.category === category));
}

function renderProducts(productsToRender = products) {
    document.getElementById('productsGrid').innerHTML = productsToRender.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3>${product.name}</h3>
            <p class="product-price">$${product.price}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existing = cartItems.find(item => item.id === productId);
    
    if (existing) {
        existing.quantity++;
    } else {
        cartItems.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    animateAddToCart(productId);
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCounter').textContent = totalItems;
    renderCartModal();
}

function renderCartModal() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const emptyMessage = document.querySelector('.cart-empty');
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item">
            <div>
                <h4>${item.name}</h4>
                <p>$${item.price} x ${item.quantity}</p>
            </div>
            <button onclick="removeFromCart(${item.id})">×</button>
        </div>
    `).join('');
    
    emptyMessage.classList.toggle('visible', cartItems.length === 0);
    document.getElementById('cartTotal').textContent = total.toFixed(2);
    document.getElementById('cartCountModal').textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    updateCart();
}

document.getElementById('cartCounter').addEventListener('click', () => {
    document.getElementById('cartModal').classList.toggle('active');
});

document.querySelector('.checkout-btn').addEventListener('click', function() {
    document.getElementById('cartModal').classList.remove('active');
});

function animateAddToCart(productId) {
    const btn = document.querySelector(`[onclick="addToCart(${productId})"]`);
    btn.classList.add('add-to-cart-animation');
    setTimeout(() => btn.classList.remove('add-to-cart-animation'), 500);
}

document.getElementById('themeToggle').addEventListener('click', () => {
    const body = document.body;
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
}