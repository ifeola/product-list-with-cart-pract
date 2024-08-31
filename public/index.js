"use strict";
const productList = document.querySelector(".products__list");
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
            Add to cart
          </button>
          <div class="counter">
            <button>-</button>
            <span>0</span>
            <button>+</button>
          </div>
        </div>
      </div>
      <div class="product__content">
        <span>${product.category}</span>
        <h3>${product.name}</h3>
        <h4>$${product.price}</h4>
      </div>
      `;
        liEl.classList.add("product__item");
        productList.appendChild(liEl);
    }
}
document.addEventListener('DOMContentLoaded', UI.fetchData);
