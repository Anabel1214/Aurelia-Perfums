const detailContainer = document.getElementById('detail-card');
const commentStorageKey = 'aurelia-comments';

function getComments(productId) {
  try {
    const saved = localStorage.getItem(commentStorageKey);
    const comments = saved ? JSON.parse(saved) : {};
    return comments[productId] || [];
  } catch (error) {
    return [];
  }
}

function saveComments(productId, comments) {
  try {
    const saved = localStorage.getItem(commentStorageKey);
    const allComments = saved ? JSON.parse(saved) : {};
    allComments[productId] = comments;
    localStorage.setItem(commentStorageKey, JSON.stringify(allComments));
  } catch (error) {
    console.error('No se pudieron guardar los comentarios.', error);
  }
}

function renderDetail() {
  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get('id'));
  const product = products.find((item) => item.id === productId);

  if (!product) {
    detailContainer.innerHTML = '<p>Producto no encontrado.</p>';
    return;
  }

  const comments = getComments(product.id);

  detailContainer.innerHTML = `
    <div class="detail-image-wrap">
      <img src="${product.image}" alt="${product.name}" />
    </div>
    <div class="detail-content">
      <h1>${product.name}</h1>
      <p>${product.description}</p>
      <div class="detail-meta">
        <span class="price">$${product.price}</span>
        <span class="notes-pill">${product.notes}</span>
      </div>
      <p class="detail-extra">Una fragancia exclusiva para quienes buscan una presencia olfativa refinada, intensa y con carácter.</p>
      <button class="btn btn-primary" data-add="${product.id}">Agregar al carrito</button>

      <section class="comments-section">
        <h3>Comentarios del perfume</h3>
        <p>Comparte tu experiencia con esta fragancia.</p>
        <form id="comment-form" class="comment-form">
          <input id="comment-name" type="text" placeholder="Tu nombre" required />
          <textarea id="comment-text" placeholder="Escribe tu comentario" required></textarea>
          <button type="submit" class="btn btn-secondary">Publicar comentario</button>
        </form>
        <div id="comments-list" class="comments-list"></div>
      </section>
    </div>
  `;

  renderComments(comments);
}

function renderComments(comments) {
  const commentsList = document.getElementById('comments-list');
  if (!commentsList) return;

  if (!comments.length) {
    commentsList.innerHTML = '<p class="cart-empty">Aún no hay comentarios. Sé el primero.</p>';
    return;
  }

  commentsList.innerHTML = comments.map((comment) => `
    <article class="comment-card">
      <strong>${comment.name}</strong>
      <span>${comment.date}</span>
      <p>${comment.text}</p>
    </article>
  `).join('');
}

detailContainer.addEventListener('click', (event) => {
  const button = event.target.closest('[data-add]');
  if (button) {
    addToCart(button.getAttribute('data-add'), button);
  }
});

document.addEventListener('submit', (event) => {
  const form = event.target.closest('#comment-form');
  if (!form) return;

  event.preventDefault();
  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get('id'));
  const nameInput = document.getElementById('comment-name');
  const textInput = document.getElementById('comment-text');

  if (!nameInput || !textInput) return;

  const comment = {
    name: nameInput.value.trim(),
    text: textInput.value.trim(),
    date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  if (!comment.name || !comment.text) return;

  const comments = getComments(productId);
  comments.unshift(comment);
  saveComments(productId, comments);
  renderComments(comments);
  form.reset();
});

renderDetail();
