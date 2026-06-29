const products = [
  {
    id: 1,
    name: 'Ajayeb Dubai',
    price: 189,
    image: 'Img/AJAYEB DUBAI.webp',
    description: 'Una fragancia amaderada y oriental con un toque de especias cálidas y una persistencia seductora.',
    notes: 'Amber · Oud · Especias'
  },
  {
    id: 2,
    name: 'Ajwad',
    price: 165,
    image: 'Img/AJWAD.webp',
    description: 'Combina frescura cítrica y profundidad woody para una propuesta elegante y muy masculina.',
    notes: 'Cítrico · Madera · Musk'
  },
  {
    id: 3,
    name: 'Al Dur',
    price: 176,
    image: 'Img/AL DUR.webp',
    description: 'Un perfume sofisticado con notas verdes y ambarinas que transmiten lujo y carácter.',
    notes: 'Verde · Ámbar · Vetiver'
  },
  {
    id: 4,
    name: 'Bad Femme',
    price: 182,
    image: 'Img/BAD FEMME.webp',
    description: 'Una sensualidad contemporánea con flores blancas, vainilla y un fondo amberado irresistible.',
    notes: 'Floral · Vainilla · Ámbar'
  },
  {
    id: 5,
    name: 'Club de Nuit',
    price: 195,
    image: 'Img/CLUB DE NUIT.webp',
    description: 'Intenso, nocturno y enigmático, con acordes amaderados y un toque de cuero elegante.',
    notes: 'Leather · Madera · Oud'
  },
  {
    id: 6,
    name: 'Granada',
    price: 159,
    image: 'Img/GRANADA.webp',
    description: 'Brillante y refinada, esta fragancia mezcla frutas rojas con un fondo suave y floral.',
    notes: 'Frutal · Floral · Suave'
  },
  {
    id: 7,
    name: 'Mashrabya',
    price: 201,
    image: 'Img/MASHRABYA.jpg',
    description: 'Una creación opulenta con notas orientales y un aura cálida que conquista desde el primer instante.',
    notes: 'Oriental · Resina · Madera'
  },
  {
    id: 8,
    name: 'Paradox',
    price: 171,
    image: 'Img/PARADOX.webp',
    description: 'Una combinación intrigante de dulzor y profundidad, ideal para quienes aman un aroma singular.',
    notes: 'Dulce · Especiado · Musk'
  },
  {
    id: 9,
    name: 'Ramz Silver',
    price: 188,
    image: 'Img/RAMZ SILVER.webp',
    description: 'Fresco y luminoso con un acabado limpio y elegante, perfecto para días de estilo refinado.',
    notes: 'Cítrico · Fresh · Musk'
  },
  {
    id: 10,
    name: 'Sevilla',
    price: 174,
    image: 'Img/SEVILLA.webp',
    description: 'Un perfume mediterráneo lleno de calor, flores y una salida brillante que recuerda al atardecer.',
    notes: 'Mediterráneo · Floral · Cítrico'
  }
];

const STORAGE_KEY = 'aurelia-cart';

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

const cart = loadCart();
const productsGrid = document.getElementById('products-grid');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const openCart = document.getElementById('open-cart');
const closeCart = document.getElementById('close-cart');
const cartPanel = document.getElementById('cart');
const overlay = document.getElementById('overlay');
const checkoutBtn = document.getElementById('checkout-btn');

function renderProducts() {
  productsGrid.innerHTML = products.map((product) => `
    <article class="product-card" data-product-id="${product.id}">
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-meta">
          <span class="price">$${product.price}</span>
          <button class="btn btn-primary" data-add="${product.id}">Agregar</button>
        </div>
        <p><strong>Notas:</strong> ${product.notes}</p>
      </div>
    </article>
  `).join('');
}

function showAddFeedback(button) {
  const feedback = document.createElement('span');
  feedback.className = 'add-feedback';
  feedback.textContent = '+1';
  const card = button.closest('.product-card');
  if (!card) return;

  card.appendChild(feedback);
  feedback.addEventListener('animationend', () => feedback.remove());
}

function addToCart(productId, sourceButton) {
  const product = products.find((item) => item.id === Number(productId));
  const existing = cart.find((item) => item.id === Number(productId));

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  if (sourceButton) {
    showAddFeedback(sourceButton);
  }

  saveCart();
  renderCart();
}

function updateQuantity(productId, change) {
  const item = cart.find((entry) => entry.id === productId);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    const index = cart.findIndex((entry) => entry.id === productId);
    cart.splice(index, 1);
  }
  saveCart();
  renderCart();
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>';
    cartCount.textContent = '0';
    cartTotal.textContent = '$0';
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <div class="cart-item">
      <div>
        <h4>${item.name}</h4>
        <p>$${item.price} c/u</p>
        <div class="cart-controls">
          <button data-dec="${item.id}">−</button>
          <span>${item.quantity}</span>
          <button data-inc="${item.id}">+</button>
        </div>
      </div>
      <strong>$${item.price * item.quantity}</strong>
    </div>
  `).join('');

  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartTotal.textContent = `$${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}`;
}

productsGrid.addEventListener('click', (event) => {
  const btn = event.target.closest('[data-add]');
  const card = event.target.closest('.product-card');

  if (btn) {
    event.stopPropagation();
    addToCart(btn.getAttribute('data-add'), btn);
    return;
  }

  if (card) {
    window.location.href = `product-detail.html?id=${card.getAttribute('data-product-id')}`;
  }
});

cartItems.addEventListener('click', (event) => {
  const dec = event.target.closest('[data-dec]');
  const inc = event.target.closest('[data-inc]');

  if (dec) {
    updateQuantity(Number(dec.getAttribute('data-dec')), -1);
  }

  if (inc) {
    updateQuantity(Number(inc.getAttribute('data-inc')), 1);
  }
});

function toggleCart(open) {
  cartPanel.classList.toggle('open', open);
  overlay.classList.toggle('show', open);
}

openCart.addEventListener('click', () => toggleCart(true));
closeCart.addEventListener('click', () => toggleCart(false));
overlay.addEventListener('click', () => toggleCart(false));
checkoutBtn.addEventListener('click', () => {
  if (!cart.length) {
    alert('Agrega al menos un perfume para finalizar tu compra.');
    return;
  }
  alert('Gracias por tu compra. Pronto te contactaremos para confirmar tu pedido.');
  cart.length = 0;
  saveCart();
  renderCart();
  toggleCart(false);
});

renderProducts();
renderCart();
