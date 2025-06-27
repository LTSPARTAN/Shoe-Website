// Cart functionality
let cartItems = [];
let wishlistItems = [];

document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart count
    updateCartCount();
    
    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Heart icon (wishlist) functionality
    const heartIcons = document.querySelectorAll('.small_card .fa-heart');
    heartIcons.forEach(icon => {
        icon.addEventListener('click', toggleWishlist);
    });

    // Share functionality
    const shareIcons = document.querySelectorAll('.small_card .fa-share');
    shareIcons.forEach(icon => {
        icon.addEventListener('click', shareProduct);
    });

    // Search functionality
    const searchInput = document.querySelector('.search_bar input');
    if (searchInput) {
        searchInput.addEventListener('input', searchProducts);
    }

    // User icon dropdown
    const userIcon = document.querySelector('.icons .fa-user');
    if (userIcon) {
        userIcon.addEventListener('click', toggleUserMenu);
    }

    // Cart icon click
    const cartIcon = document.querySelector('.icons .fa-cart-shopping');
    if (cartIcon) {
        cartIcon.addEventListener('click', showCart);
    }

    // Price range filter
    initializePriceFilter();
});

// Add to Cart Function
function addToCart(e) {
    e.preventDefault();
    const productCard = e.target.closest('.card');
    const productInfo = {
        name: productCard.querySelector('h2').textContent,
        price: productCard.querySelector('h3').textContent,
        image: productCard.querySelector('.image img').src
    };
    
    cartItems.push(productInfo);
    updateCartCount();
    
    // Show notification
    showNotification('Product added to cart!');
}

// Update Cart Count
function updateCartCount() {
    const cartIcon = document.querySelector('.icons .fa-cart-shopping');
    if (cartIcon) {
        // Create or update cart count badge
        let badge = cartIcon.querySelector('.cart-count');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-count';
            cartIcon.appendChild(badge);
        }
        badge.textContent = cartItems.length;
    }
}

// Wishlist Toggle Function
function toggleWishlist(e) {
    const icon = e.target;
    icon.classList.toggle('active');
    
    const productCard = icon.closest('.card');
    const productName = productCard.querySelector('h2').textContent;
    
    if (icon.classList.contains('active')) {
        wishlistItems.push(productName);
        showNotification('Added to wishlist!');
    } else {
        const index = wishlistItems.indexOf(productName);
        if (index > -1) {
            wishlistItems.splice(index, 1);
        }
        showNotification('Removed from wishlist!');
    }
}

// Share Product Function
function shareProduct(e) {
    const productCard = e.target.closest('.card');
    const productName = productCard.querySelector('h2').textContent;
    
    // Create share data
    const shareData = {
        title: 'Check out this product!',
        text: `Check out the ${productName} on our store!`,
        url: window.location.href
    };
    
    // Use Web Share API if available
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => showNotification('Shared successfully!'))
            .catch(() => showNotification('Error sharing product'));
    } else {
        // Fallback for browsers that don't support Web Share API
        showNotification('Sharing is not supported on this browser');
    }
}

// Search Products Function
function searchProducts(e) {
    const searchTerm = e.target.value.toLowerCase();
    const products = document.querySelectorAll('.card');
    
    products.forEach(product => {
        const productName = product.querySelector('h2').textContent.toLowerCase();
        const productDesc = product.querySelector('p').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDesc.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Show Cart Function
function showCart() {
    // Create cart modal
    const modal = document.createElement('div');
    modal.className = 'cart-modal';
    
    let cartContent = '<div class="cart-content">';
    cartContent += '<h2>Shopping Cart</h2>';
    
    if (cartItems.length === 0) {
        cartContent += '<p>Your cart is empty</p>';
    } else {
        cartItems.forEach((item, index) => {
            cartContent += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>${item.price}</p>
                    </div>
                    <button onclick="removeFromCart(${index})">Remove</button>
                </div>
            `;
        });
        
        // Add checkout button
        cartContent += '<button class="checkout-btn">Proceed to Checkout</button>';
    }
    
    cartContent += '<button class="close-modal">Close</button>';
    cartContent += '</div>';
    
    modal.innerHTML = cartContent;
    document.body.appendChild(modal);
    
    // Close modal functionality
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// Remove from Cart Function
function removeFromCart(index) {
    cartItems.splice(index, 1);
    updateCartCount();
    showCart(); // Refresh cart modal
    showNotification('Product removed from cart!');
}

// Show Notification Function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Initialize Price Filter
function initializePriceFilter() {
    const filterSection = document.createElement('div');
    filterSection.className = 'price-filter';
    filterSection.innerHTML = `
        <h3>Filter by Price</h3>
        <input type="range" min="0" max="500" value="500" class="price-range">
        <span class="price-value">$500</span>
    `;
    
    // Insert filter before products section
    const productsSection = document.querySelector('.products');
    if (productsSection) {
        productsSection.insertBefore(filterSection, productsSection.querySelector('.box'));
        
        // Add filter functionality
        const rangeInput = filterSection.querySelector('.price-range');
        const priceValue = filterSection.querySelector('.price-value');
        
        rangeInput.addEventListener('input', (e) => {
            const maxPrice = e.target.value;
            priceValue.textContent = `$${maxPrice}`;
            
            // Filter products
            const products = document.querySelectorAll('.card');
            products.forEach(product => {
                const price = parseFloat(product.querySelector('h3').textContent.replace('$', ''));
                if (price <= maxPrice) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }
}

// User Menu Toggle
function toggleUserMenu() {
    const existingMenu = document.querySelector('.user-menu');
    if (existingMenu) {
        document.body.removeChild(existingMenu);
        return;
    }
    
    const menu = document.createElement('div');
    menu.className = 'user-menu';
    menu.innerHTML = `
        <ul>
            <li><a href="#profile">Profile</a></li>
            <li><a href="#orders">Orders</a></li>
            <li><a href="#wishlist">Wishlist (${wishlistItems.length})</a></li>
            <li><a href="#logout">Logout</a></li>
        </ul>
    `;
    
    const userIcon = document.querySelector('.icons .fa-user');
    const rect = userIcon.getBoundingClientRect();
    
    menu.style.position = 'absolute';
    menu.style.top = `${rect.bottom + 5}px`;
    menu.style.right = '20px';
    
    document.body.appendChild(menu);
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu') && !e.target.closest('.fa-user')) {
            const menu = document.querySelector('.user-menu');
            if (menu) {
                document.body.removeChild(menu);
            }
        }
    });
} 