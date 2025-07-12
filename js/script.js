// Toggle Menu Mobile
function toggleMenu() {
  const nav = document.getElementById('nav');
  nav.classList.toggle('open');
}

// Keranjang
let cart = [];
let cartCount = 0;

function addToCart(productName, price) {
  cart.push({ name: productName, price: price });
  cartCount++;
  document.querySelector('.cart-count').textContent = cartCount;

  const cartIcon = document.querySelector('.cart-icon');
  cartIcon.style.transform = 'scale(1.2)';
  setTimeout(() => {
    cartIcon.style.transform = 'scale(1)';
  }, 200);

  showNotification(`${productName} ditambahkan ke keranjang!`);
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, #0066cc, #0099ff);
    color: #fff;
    padding: 1rem 2rem;
    border-radius: 25px;
    font-weight: 600;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
    box-shadow: 0 10px 30px rgba(0, 102, 204, 0.3);
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      document.getElementById('nav').classList.remove('open');
    }
  });
});

// Shadow Header Saat Scroll
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.boxShadow = 'none';
  }
});

// Efek Fade In Saat Scroll
const fadeElements = document.querySelectorAll('section, .product-card, .category-card');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(element => {
  fadeObserver.observe(element);
});

// Modal Produk
const modal = document.getElementById("product-modal");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalPrice = document.getElementById("modal-price");

document.querySelectorAll(".product-card").forEach(card => {
  card.addEventListener("click", () => {
    const img = card.querySelector("img").src;
    const name = card.querySelector(".product-name").textContent;
    const desc = card.querySelector(".product-description").textContent;
    const price = card.querySelector(".product-price").textContent;

    modalImage.src = img;
    modalTitle.textContent = name;
    modalDescription.textContent = desc;
    modalPrice.textContent = price;

    modal.style.display = "flex";
  });
});

document.querySelector(".close-btn").onclick = () => {
  modal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

// Cegah modal terbuka saat klik tombol 'Tambah ke Keranjang'
document.querySelectorAll('.product-card .add-to-cart').forEach(button => {
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = e.target.closest('.product-card');
    const name = card.querySelector('.product-name').textContent;
    const price = card.querySelector('.product-price').textContent;
    addToCart(name, price);
  });
});

// Tombol 'Beli Sekarang' di dalam modal
document.querySelector("#product-modal .add-to-cart").addEventListener("click", () => {
  const name = modalTitle.textContent;
  const price = modalPrice.textContent;
  addToCart(name, price);
});

// Hover Produk Tambah Efek Interaktif
document.querySelectorAll(".product-card").forEach(card => {
  card.addEventListener("mouseover", () => {
    card.style.transform = "scale(1.02)";
    card.style.transition = "all 0.3s ease";
  });
  card.addEventListener("mouseout", () => {
    card.style.transform = "scale(1)";
  });
});

// Simpan isi keranjang di localStorage
window.addEventListener("beforeunload", () => {
  localStorage.setItem("cart", JSON.stringify(cart));
});

window.addEventListener("DOMContentLoaded", () => {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    cartCount = cart.length;
    document.querySelector('.cart-count').textContent = cartCount;
  }
});

// Tampilkan/Hide Dropdown
const cartIcon = document.querySelector('.cart-icon');
const cartDropdown = document.getElementById('cart-dropdown');

cartIcon.addEventListener('click', (e) => {
  e.stopPropagation();
  cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
  renderCartItems();
});

window.addEventListener('click', () => {
  cartDropdown.style.display = 'none';
});

// Render isi keranjang
function renderCartItems() {
  const list = document.getElementById('cart-items');
  const totalElement = document.getElementById('cart-total');
  list.innerHTML = '';

  let total = 0;
  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
  <span>${item.name}</span>
  <span>
    ${item.price}
    <button onclick="removeFromCart(${index})" title="Hapus">&#10006;</button>
  </span>
`;
    list.appendChild(li);

    total += parseInt(item.price.replace(/[^0-9]/g, ''));
  });

  totalElement.textContent = `Rp ${total.toLocaleString()}`;
}

// Hapus item dari keranjang
function removeFromCart(index) {
  cart.splice(index, 1);
  cartCount--;
  document.querySelector('.cart-count').textContent = cartCount;
  renderCartItems();
}
