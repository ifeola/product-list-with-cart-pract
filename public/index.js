"use strict";
const productList = document.querySelector(".products__list");
const cartList = document.querySelector(".cart__list");
const cart = document.querySelector(".cart");
const confirmOder = document.querySelector('.confirm-order');
const count = 0;
class Product {
    constructor(image, name, category, price) {
        this.image = image;
        this.name = name;
        this.category = category;
        this.price = price;
    }
}
class UI {
    static fetchData() {
        fetch("./src/data.json")
            .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json(); // Parse the JSON data from the response
        })
            .then((data) => {
            // Use the JSON data here
            data.forEach((element) => UI.addProduct(element));
        })
            .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
        });
    }
    static addProduct(product) {
        const liEl = document.createElement("li");
        liEl.innerHTML = `
      <div class="product__img">
        <img
          src=${product.image.desktop}
          alt=${product.category} />
        <div class="add-to-cart">
          <button class="add-to-cart-btn">
            <img
              src="/assets/images/icon-add-to-cart.svg"
              alt="cart icon image" />
            <span>Add to cart</span>
          </button>
          <div class="counter">
            <button id="decrease-count">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>
            </button>
            <span class="count">${count}</span>
            <button id="increase-count">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 10">
                <path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z">
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="product__content">
        <span class"product__category">${product.category}</span>
        <h3 class="product__name">${product.name}</h3>
        <h4>$<span class="product__price">${product.price}</span></h4>
      </div>
      `;
        liEl.classList.add("product__item");
        productList.appendChild(liEl);
    }
    static getProduct(target) {
        var _a, _b;
        if (target.classList.contains('add-to-cart-btn')) {
            target.classList.add('inactive');
            (_a = target.nextElementSibling) === null || _a === void 0 ? void 0 : _a.classList.add('active');
            let countContainer = (_b = target.nextElementSibling) === null || _b === void 0 ? void 0 : _b.querySelector('.count');
            let productCount = Number(countContainer === null || countContainer === void 0 ? void 0 : countContainer.textContent);
            productCount++;
            if (!countContainer)
                return;
            countContainer.textContent = String(productCount);
            let product = target.closest('.product__item');
            UI.addProductToCart(product);
            UI.updateItemCount();
            UI.updateGrandTotal();
        }
    }
    static addProductToCart(product) {
        var _a, _b;
        let productName = (_a = product.querySelector(".product__name")) === null || _a === void 0 ? void 0 : _a.textContent;
        let productPrice = Number((_b = product.querySelector(".product__price")) === null || _b === void 0 ? void 0 : _b.textContent);
        UI.createOrder(productName, productPrice);
    }
    static createOrder(productName, productPrice) {
        const cartItem = document.createElement("li");
        cartItem.classList.add('cart__item');
        cartItem.innerHTML = `
        <div class="cart__content">
          <h3 class="item__title">${productName}</h3>
          <div>
            <div class="unit-bg">
              <span class="unit">${1}</span><span>x</span>
            </div>
            <div class="unit-price-bg">@ $<span class="unit-price">${productPrice}</span></div>
            <h4>$<span class="total-price">${productPrice}</span></h4>
          </div>
        </div>
        <button class="cart-delete-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="size-5">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
              clip-rule="evenodd" />
          </svg>
        </button>
      `;
        cartList.appendChild(cartItem);
        UI.cartToggle(cartList);
    }
    static increaseCount(target) {
        if (target.id === "increase-count") {
            let countEl = target.previousElementSibling;
            let count = Number(countEl.textContent);
            count++;
            if (!countEl)
                return;
            countEl.textContent = String(count);
            UI.updateUnit(count, target);
            UI.updateItemCount();
            UI.updateGrandTotal();
            UI.cartToggle(cartList);
        }
    }
    static decreaseCount(target) {
        var _a, _b, _c;
        if (target.id === "decrease-count") {
            let countEl = target.nextElementSibling;
            let count = Number(countEl.textContent);
            count--;
            if (!countEl)
                return;
            countEl.textContent = String(count);
            if (count === 0) {
                (_b = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.previousElementSibling) === null || _b === void 0 ? void 0 : _b.classList.remove('inactive');
                (_c = target.parentElement) === null || _c === void 0 ? void 0 : _c.classList.remove('active');
            }
            UI.updateUnit(count, target);
            UI.updateItemCount();
            UI.updateGrandTotal();
            UI.cartToggle(cartList);
        }
    }
    static updateUnit(count, target) {
        var _a, _b, _c;
        let cartItems = Array.from(cartList.children);
        let targetParentTitle = (_c = (_b = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.closest('.product__item')) === null || _b === void 0 ? void 0 : _b.querySelector('.product__name')) === null || _c === void 0 ? void 0 : _c.textContent;
        cartItems.forEach(item => {
            var _a;
            let itemTitle = (_a = item.querySelector('.item__title')) === null || _a === void 0 ? void 0 : _a.textContent;
            if (itemTitle === targetParentTitle) {
                let itemCount = item.querySelector(".unit");
                itemCount.textContent = String(count);
                let unit = item.querySelector(".unit-price");
                let itemTotal = item.querySelector(".total-price");
                itemTotal.textContent = String(Number(unit === null || unit === void 0 ? void 0 : unit.textContent) * count);
                if (itemCount.textContent === "0") {
                    cartList.removeChild(item);
                }
            }
        });
    }
    static updateItemCount() {
        let cartItems = Array.from(cartList.children);
        let countArray = [];
        cartItems.forEach(item => {
            var _a;
            let itemCount = Number((_a = item.querySelector('.unit')) === null || _a === void 0 ? void 0 : _a.textContent);
            countArray.push(itemCount);
        });
        let totalCount = countArray.reduce((previousValue, nextValue) => {
            return previousValue + nextValue;
        }, 0);
        const itemsCount = cart.querySelector('.items__count');
        itemsCount.textContent = String(totalCount);
    }
    static updateGrandTotal() {
        let cartItems = Array.from(cartList.children);
        let totalArray = [];
        cartItems.forEach(item => {
            var _a;
            let itemTotal = Number((_a = item.querySelector('.total-price')) === null || _a === void 0 ? void 0 : _a.textContent);
            totalArray.push(itemTotal);
        });
        let grandTotal = totalArray.reduce((previousValue, nextValue) => {
            return previousValue + nextValue;
        }, 0);
        const itemsTotal = cart.querySelector('.grand-total');
        itemsTotal.textContent = String(grandTotal);
    }
    static cartToggle(cartList) {
        const cartInactive = document.querySelector('.cart__inactive');
        const cartActive = document.querySelector('.cart__active');
        if (cartList.children.length >= 1) {
            cartInactive.classList.add('inactive');
            cartActive.classList.add('active');
        }
        else {
            cartInactive.classList.remove('inactive');
            cartActive.classList.remove('active');
        }
    }
    static removeCartItem(target) {
        var _a;
        if (target.classList.contains('cart-delete-btn')) {
            const cartItem = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.closest('.cart__item');
            // Get item price and item unit count
            const cartItemPrice = cartItem.querySelector('.total-price');
            const cartItemUnit = cartItem.querySelector('.unit');
            // Get Total price and total unit count
            const totalPrice = cart.querySelector('.grand-total');
            const totalUnit = cart.querySelector('.items__count');
            // Set Grand total
            let totalRemaining = Number(totalPrice.textContent) - Number(cartItemPrice.textContent);
            totalPrice.textContent = totalRemaining.toString();
            // Set Unit total
            let unitRemaining = Number(totalUnit.textContent) - Number(cartItemUnit.textContent);
            totalUnit.textContent = unitRemaining.toString();
            let cartItemHeading = cartItem.querySelector('.item__title');
            UI.resetProductItem(cartItemHeading);
            // Remove cart item from cart lists
            cartList.removeChild(cartItem);
        }
        UI.cartToggle(cartList);
    }
    static resetProductItem(title) {
        let productLists = Array.from(productList.children);
        productLists.forEach(productList => {
            let productTitle = productList.querySelector('.product__name');
            if (productTitle.textContent === title.textContent) {
                const addToCartBtn = productList.querySelector('.add-to-cart-btn');
                const counterBtn = productList.querySelector('.counter');
                const count = productList.querySelector('.count');
                count.textContent = String(0);
                counterBtn.classList.remove('active');
                addToCartBtn.classList.remove('inactive');
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', UI.fetchData);
productList.addEventListener('click', (e) => {
    const target = e.target;
    UI.getProduct(target);
    // Increase the Count of each cart list
    UI.increaseCount(target);
    // Increase the Count of each cart list
    UI.decreaseCount(target);
});
cartList.addEventListener('click', (e) => {
    const target = e.target;
    UI.removeCartItem(target);
});
confirmOder.addEventListener('click', (e) => {
    // Get Total price and total unit count
    const totalPrice = cart.querySelector('.grand-total');
    const totalUnit = cart.querySelector('.items__count');
    // Get productList titles
    const cartListItems = Array.from(cartList.children);
    cartListItems.forEach(listItem => {
        let listTitle = listItem.querySelector('.item__title');
        UI.resetProductItem(listTitle);
    });
    // Set Grand and Unit total
    totalPrice.textContent = String(0);
    totalUnit.textContent = String(0);
    cartList.innerHTML = "";
    UI.cartToggle(cartList);
});
