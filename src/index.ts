const productList = document.querySelector(".products__list") as HTMLUListElement;
const cartList = document.querySelector(".cart__list") as HTMLUListElement;
const cart = document.querySelector(".cart") as HTMLElement;

const count: number = 0;

type product = {
  image: {
    thumbnail: string,
    mobile: string,
    tablet: string,
    desktop: string,
  };
  name: string;
  category: string;
  price: number;
}

class Product {
  image: {
    thumbnail: string,
    mobile: string,
    tablet: string,
    desktop: string,
  };
  name: string;
  category: string;
  price: number;


  constructor(image: { thumbnail: string, mobile: string, tablet: string, desktop: string }, name: string, category: string, price: number) {
    this.image = image;
    this.name = name;
    this.category = category;
    this.price = price;
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
        data.forEach((element: product) => 
          UI.addProduct(element)
        );
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
    }

    static addProduct(product: product) {
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

    static getProduct(target: HTMLElement) {
      if (target.classList.contains('add-to-cart-btn')) {
        target.classList.add('inactive');
        target.nextElementSibling?.classList.add('active');
        
        let countContainer = target.nextElementSibling?.querySelector('.count') as HTMLElement;
        let productCount: number = Number(countContainer?.textContent);
        productCount++;
        if (!countContainer) return;
        countContainer.textContent = String(productCount);

        let product = target.closest('.product__item') as HTMLElement;
        UI.addProductToCart(product)
        UI.updateItemCount()
        UI.updateGrandTotal()
      }
    }

    static addProductToCart(product: HTMLElement) {
      let productName: string = product.querySelector(".product__name")?.textContent!;
      let productPrice: number = Number(product.querySelector(".product__price")?.textContent);
     
      UI.createOrder(productName, productPrice)
    }

    static createOrder(productName: string, productPrice: number) {
      const cartItem = document.createElement("li");
      cartItem.classList.add('cart__item');
      cartItem.innerHTML = `
        <div class="cart__content">
          <h3 class="item__title">${productName}</h3>
          <div>
            <div>
              <span class="unit">${1}</span>
              <span>x</span>
            </div>
            <div>$<span class="unit-price">${productPrice}</span></div>
            <h4>$<span class="total-price">${productPrice}</span></h4>
          </div>
        </div>
        <button class="cart-btn">
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
      `
      cartList.appendChild(cartItem);
      UI.cartToggle()
    }

    static increaseCount(target: HTMLElement) {
      if (target.id === "increase-count") {
        let countEl = target.previousElementSibling as HTMLElement;
        
        let count: number = Number(countEl.textContent);
        count++;
        if (!countEl) return;
        countEl.textContent = String(count);
        UI.updateUnit(count, target)
        UI.updateItemCount()
        UI.updateGrandTotal()
        UI.cartToggle()
      }
    }

    static decreaseCount(target: HTMLElement) {
      if (target.id === "decrease-count") {
        let countEl = target.nextElementSibling as HTMLElement;
        
        let count: number = Number(countEl.textContent);
        count--;
        if (!countEl) return;
        countEl.textContent = String(count);
        if (count === 0) {
          target.parentElement?.previousElementSibling?.classList.remove('inactive');
          target.parentElement?.classList.remove('active');
        }
        UI.updateUnit(count, target)
        UI.updateItemCount()
        UI.updateGrandTotal()
        UI.cartToggle()
      }
    }

    static updateUnit(count: number, target: HTMLElement) {
      let cartItems = Array.from(cartList.children as HTMLCollection);
      let targetParentTitle: string = target.parentElement?.closest('.product__item')?.querySelector('.product__name')?.textContent!;
  
      cartItems.forEach(item => {
        let itemTitle: string = item.querySelector('.item__title')?.textContent!;
        if (itemTitle === targetParentTitle) {
          let itemCount = item.querySelector(".unit") as HTMLElement;
          if (!itemCount) return;
          itemCount.textContent = String(count);

          let unit = item.querySelector(".unit-price") as HTMLElement;
          let itemTotal = item.querySelector(".total-price") as HTMLElement;
          if (!itemTotal) return;
          itemTotal.textContent = String(Number(unit?.textContent) * count);

          if (itemCount.textContent === "0") {
            cartList.removeChild(item);
          }
        }
      })
    }

    static updateItemCount() {
      let cartItems = Array.from(cartList.children as HTMLCollection);
      let countArray: number[] = [];
      cartItems.forEach(item => {
        let itemCount: number = Number(item.querySelector('.unit')?.textContent);
        countArray.push(itemCount);
      })

      let totalCount = countArray.reduce((previousValue: number, nextValue: number) => {
        return previousValue + nextValue;
      }, 0);
      
      const itemsCount = cart.querySelector('.items__count') as HTMLSpanElement;
      itemsCount.textContent = String(totalCount);
    }

    static updateGrandTotal() {
      let cartItems = Array.from(cartList.children as HTMLCollection);
      let totalArray: number[] = [];
      cartItems.forEach(item => {
        let itemTotal: number = Number(item.querySelector('.total-price')?.textContent);
        totalArray.push(itemTotal);
      })

      let grandTotal = totalArray.reduce((previousValue: number, nextValue: number) => {
        return previousValue + nextValue;
      }, 0);
      
      const itemsTotal = cart.querySelector('.grand-total') as HTMLSpanElement;
      itemsTotal.textContent = String(grandTotal);
    } 

    static cartToggle() {
      const cartInactive = document.querySelector('.cart__inactive') as HTMLDivElement;
      const cartActive = document.querySelector('.cart__active') as HTMLDivElement;
      if (cartList.children.length >= 1) {
        cartInactive.classList.add('inactive');
        cartActive.classList.add('active');
      } else {
        cartInactive.classList.remove('inactive');
        cartActive.classList.remove('active');
      }
    }
  }

document.addEventListener('DOMContentLoaded', UI.fetchData);
productList.addEventListener('click', (e: Event) => {
  const target = e.target as HTMLElement;
  UI.getProduct(target);

  // Increase the Count of each cart list
  UI.increaseCount(target);

  // Increase the Count of each cart list
  UI.decreaseCount(target);
})