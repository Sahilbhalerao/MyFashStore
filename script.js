// Products data (in a real app, this would come from a database)
const products = [
    { id: 1, name: "T-Shirt", price: 19.99, image: "/api/placeholder/300/300" },
    { id: 2, name: "Jeans", price: 39.99, image: "/api/placeholder/300/300" },
    { id: 3, name: "Sneakers", price: 49.99, image: "/api/placeholder/300/300" },
    { id: 4, name: "Watch", price: 99.99, image: "/api/placeholder/300/300" },
    { id: 5, name: "Backpack", price: 59.99, image: "/api/placeholder/300/300" }
];

// Initialize cart from localStorage or empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// Add to cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add to cart buttons on shop page
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.parentElement.dataset.id);
                addToCart(productId);
                
                // Google Analytics event would go here
                console.log('Product added to cart:', productId);
            });
        });
    }
    
    // Display cart items if on cart page
    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
    
    // Display checkout items if on checkout page
    if (window.location.pathname.includes('checkout.html')) {
        displayCheckoutItems();
    }
    
    // Handle shipping form submission
    const shippingForm = document.getElementById('shipping-form');
    if (shippingForm) {
        shippingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Google Analytics event would go here
            console.log('Order placed');
            
            alert('Thank you for your order!');
            // Clear cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            
            // Redirect to home page
            window.location.href = 'index.html';
        });
    }
    
    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Google Analytics event would go here
            console.log('Contact form submitted');
            
            alert('Your message has been sent!');
            this.reset();
        });
    }
});

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    alert(`${product.name} added to cart!`);
}

// Update cart count in navigation
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

// Display cart items on cart page
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        checkoutBtn.disabled = true;
        cartTotal.textContent = '$0.00';
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    checkoutBtn.disabled = false;
    cartItemsContainer.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <div class="quantity">
                <button class="decrease-quantity" data-id="${item.id}">-</button>
                <span>${item.quantity}</span>
                <button class="increase-quantity" data-id="${item.id}">+</button>
            </div>
            <button class="remove-item" data-id="${item.id}">Remove</button>
        `;
        
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    cartTotal.textContent = `$${total.toFixed(2)}`;
    
    // Add event listeners for quantity changes and remove buttons
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const item = cart.find(item => item.id === id);
            item.quantity += 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
            updateCartCount();
        });
    });
    
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const item = cart.find(item => item.id === id);
            
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                // Remove item if quantity would be 0
                cart = cart.filter(cartItem => cartItem.id !== id);
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
            updateCartCount();
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            cart = cart.filter(item => item.id !== id);
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
            updateCartCount();
        });
    });
}

// Display checkout items
function displayCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    if (!checkoutItemsContainer) return;
    
    if (cart.length === 0) {
        // Redirect to cart if no items
        window.location.href = 'cart.html';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const checkoutItemElement = document.createElement('div');
        checkoutItemElement.className = 'checkout-item';
        checkoutItemElement.innerHTML = `
            <div>${item.name} x${item.quantity}</div>
            <div>$${itemTotal.toFixed(2)}</div>
        `;
        
        checkoutItemsContainer.appendChild(checkoutItemElement);
    });
    
    checkoutTotal.textContent = `$${total.toFixed(2)}`;
}