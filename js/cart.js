/* ==========================================================================
   Cart System & Drawer Controller - Perfumaria Paris Joias em Prata 925
   ========================================================================== */

(function() {
  const FREE_SHIPPING_THRESHOLD = 299.00;
  const WHATSAPP_PHONE = '5585992029639'; // (31) 98702-9034
  let cart = [];

  // Load from LocalStorage
  try {
    const saved = localStorage.getItem('perfumariaparis_cart');
    if (saved) {
      cart = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }

  function saveCart() {
    try {
      localStorage.setItem('perfumariaparis_cart', JSON.stringify(cart));
    } catch (e) {}
    updateCartUI();
  }

  function formatCurrency(val) {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Update badges
    const badge = document.getElementById('cart-badge');
    if (badge) badge.textContent = totalCount;

    const drawerCount = document.getElementById('cart-drawer-count');
    if (drawerCount) drawerCount.textContent = totalCount;

    // Subtotal
    const subtotalEl = document.getElementById('cart-subtotal-val');
    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);

    // Free shipping progress
    const meterText = document.getElementById('shipping-progress-text');
    const meterFill = document.getElementById('shipping-progress-fill');
    if (meterText && meterFill) {
      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        meterText.innerHTML = '✨ Parabéns! Você ganhou <strong>FRETE SEGURO GRÁTIS</strong>!';
        meterFill.style.width = '100%';
        meterFill.style.backgroundColor = '#0F172A';
      } else {
        const diff = FREE_SHIPPING_THRESHOLD - subtotal;
        const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
        meterText.innerHTML = `Faltam <strong>${formatCurrency(diff)}</strong> para <strong>FRETE GRÁTIS SEGURO</strong>`;
        meterFill.style.width = pct + '%';
        meterFill.style.backgroundColor = '#0F172A';
      }
    }

    // Render items
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-message">
          Sua sacola de joias está vazia.<br>Descubra peças exclusivas em <strong>Prata Legítima 925</strong>!
        </div>
      `;
      return;
    }

    container.innerHTML = cart.map((item, index) => `
      <div class="cart-item-row">
        <img src="${item.image}" alt="${item.title}" class="cart-item-thumb">
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.title}</h4>
          <span class="cart-item-certificate-tag">✓ Prata Legítima 925 & Garantia Vitalícia</span>
          <span class="cart-item-price">${formatCurrency(item.price)}</span>
          <div class="cart-item-qty-row">
            <button class="qty-control-btn" onclick="window.updateItemQty(${index}, -1)" aria-label="Diminuir">-</button>
            <span style="font-weight: 600; font-size: 13px; min-width: 18px; text-align: center;">${item.qty}</span>
            <button class="qty-control-btn" onclick="window.updateItemQty(${index}, 1)" aria-label="Aumentar">+</button>
            <button onclick="window.removeItemFromCart(${index})" style="margin-left: auto; color: #EF4444; font-size: 11px; font-weight: 600; text-decoration: underline; cursor: pointer; border: none; background: none;">Remover</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Global window functions
  window.openCartDrawer = function() {
    const overlay = document.getElementById('cart-drawer-overlay');
    const panel = document.getElementById('cart-drawer-panel');
    if (overlay && panel) {
      overlay.classList.add('active');
      panel.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeCartDrawer = function() {
    const overlay = document.getElementById('cart-drawer-overlay');
    const panel = document.getElementById('cart-drawer-panel');
    if (overlay && panel) {
      overlay.classList.remove('active');
      panel.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Direct Add to Cart without sizes
  window.buyJewelryDirect = function(title, price, image) {
    const existingIndex = cart.findIndex(i => i.title === title);
    if (existingIndex > -1) {
      cart[existingIndex].qty += 1;
    } else {
      cart.push({
        title,
        price,
        image,
        qty: 1
      });
    }

    saveCart();
    window.showToast(`✨ Adicionado à Sacola: ${title}`);
    window.openCartDrawer();
  };

  window.updateItemQty = function(index, delta) {
    if (!cart[index]) return;
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    saveCart();
  };

  window.removeItemFromCart = function(index) {
    if (!cart[index]) return;
    const removedTitle = cart[index].title;
    cart.splice(index, 1);
    saveCart();
    window.showToast(`Item removido: ${removedTitle}`);
  };

  window.finishCheckout = function() {
    if (cart.length === 0) {
      window.showToast('Sua sacola de joias está vazia!');
      return;
    }
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const orderItems = cart.map(i => `• ${i.title} (x${i.qty}) - ${formatCurrency(i.price * i.qty)}`).join('%0A');
    const msg = `Olá! Gostaria de finalizar meu pedido na Perfumaria Paris Joias em Prata 925:%0A%0A${orderItems}%0A%0ATotal: ${formatCurrency(subtotal)}%0A%0APor favor, me envie as opções para pagamento via Pix/Cartão e envio/retirada no Box 111 Eldorado.`;
    window.location.href = `https://wa.me/${WHATSAPP_PHONE}?text=${msg}`;
    // Notificações desativadas
  };

  // Initial update
  document.addEventListener('DOMContentLoaded', updateCartUI);
})();
