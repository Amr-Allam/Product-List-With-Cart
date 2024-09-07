"use strict";

// Fetch card data from JSON file
const jsonFile = async function () {
  const res = await fetch("data.json");
  const file = await res.json();
  for (const data of file) {
    const order = `
            <div class="card">
              <img src="${data["image"]["desktop"]}"/>
              <h3>${data["category"]}</h3>
              <h4>${data["name"]}</h4>
              <p>$${data["price"].toFixed(2)}</p>
              <div class="btn-add-to-cart">
                <img src="assets/images/icon-add-to-cart.svg" /> Add to Cart
              </div>
            </div>
    `;
    cardContainer.insertAdjacentHTML("afterbegin", order);
  }
};
jsonFile();

// Add orders to cart
const addOrders = function (e) {
  emptyCart.style.display = "none";
  emptyCart.previousElementSibling.style.display = "none";

  const card = e.target.closest(".card");
  const orderName = card.querySelector("h4").textContent;
  const orderPrice = Number(
    card.querySelector("p").textContent.slice(1)
  ).toFixed(2);
  const category = card
    .closest(".card")
    .querySelector("h3")
    .textContent.replace(" ", "-")
    .toLowerCase();
  card.classList.add(`${category}`);

  if (cartOrderContainer.querySelector(`.${category}`)) return;

  e.target.innerHTML = `<button class="decrement">&#8722;</button><span class = "counter">1</span><button class="increment">+</button>`;

  const order = `
    <div class="order ${category}">
      <div class="order-info">
        <p class="order-name">${orderName}</p>
        <p>
          <span class="order-counter">1x</span>
          <span class="order-price-each">@ $${orderPrice}</span>
          <span class="order-price">$${orderPrice}</span>
        </p>
      </div>
      <button class="btn-order-remove">⨯</button>
    </div>
`;
  cartOrderContainer.insertAdjacentHTML("afterbegin", order);

  totalPrice = totalPrice + Number(orderPrice);
  if (!cartOrderContainer.nextElementSibling) {
    const confirmOrder = `
          <div class="order-confirm">
            <div class="order-total">
              <p class="order-total-label">Order Total</p>
              <p class="order-total-price">$${totalPrice.toFixed(2)}</p>
            </div>
            <div class="carbon-neutral">
              <img src="assets/images/icon-carbon-neutral.svg" />This is a
              <span>carbon-neutral</span> delivery
            </div>
            <button class="btn-confirm-order btn-order">Confirm Order</button>
          </div>
      `;
    cartOrderContainer.insertAdjacentHTML("afterend", confirmOrder);
  } else {
    cartOrderContainer.nextElementSibling.querySelector(
      ".order-total-price"
    ).textContent = `$${totalPrice.toFixed(2)}`;
  }
};

// Increment and decrement variables
const incDecVars = function (e) {
  const cartCounter = e.target.parentElement.querySelector("span");
  let counter = Number(cartCounter.textContent);

  const category = e.target
    .closest(".card")
    .querySelector("h3")
    .textContent.replace(" ", "-")
    .toLowerCase();

  const order = cartOrderContainer.querySelector(`.${category}`);
  const priceEach = Number(
    order.querySelector(".order-price-each").textContent.slice(3)
  );

  return { cartCounter, counter, category, order, priceEach };
};

// Update total price in cart
const updateTotalPrice = function () {
  cartOrderContainer.nextElementSibling.querySelector(
    ".order-total-price"
  ).textContent = `$${totalPrice.toFixed(2)}`;
};

// Remove 1 order from cart
const removeOrder = function (order, category) {
  updateTotalPrice();
  order.remove();
  if (cartOrderContainer.childElementCount === 0) {
    cartOrderContainer.nextElementSibling.remove();
    emptyCart.style.display = "block";
    emptyCart.previousElementSibling.style.display = "initial";
  }
  defaultAddCardStyle(category);
};

// Update number of orders in cart
const updateCartNumber = function () {
  let counter = 0;
  const yourCart = document.querySelector(".cart h2");
  const orders = [...cartOrderContainer.querySelectorAll(".order")];
  for (const order of orders) {
    counter += parseInt(order.querySelector(".order-counter").textContent);
  }
  yourCart.textContent = `Your Cart (${counter})`;
};

// Click styles to add-to-cart
const clickedAddCartStyle = function (e) {
  e.target.classList.add("btn-add-to-cart-clicked");
  e.target.parentElement
    .querySelector("img")
    .style.setProperty("outline", "3px solid var(--Red)");
};

// Reset everything in card
const defaultAddCardStyle = function (category) {
  const card = cardContainer.querySelector(`.${category}`);
  const cardBtn = card.querySelector(".btn-add-to-cart");

  card.querySelector("img").style.outline = "none";
  cardBtn.classList.remove("btn-add-to-cart-clicked");
  cardBtn.innerHTML = `<img src="assets/images/icon-add-to-cart.svg" /> Add to Cart`;
};

// Adding orders to confirmed orders window
const createConfirmedOrders = function (orders) {
  for (let order of orders) {
    const category = [...order.classList][1];
    const card = cardContainer.querySelector(`.${category}`);
    const orderName = card.querySelector("h4").textContent;
    const orderPrice = Number(card.querySelector("p").textContent.slice(1));
    const img = card.querySelector("img").getAttribute("src");

    const counter = parseInt(order.querySelector(".order-counter").textContent);
    const confirmedOrder = `
          <div class="order">
            <img src="${img}"/>
            <div class="order-info">
              <p class="order-name">${orderName}</p>
              <p>
                <span class="order-counter">${counter}x</span>
                <span class="order-price-each">@ $${orderPrice.toFixed(
                  2
                )}</span>
              </p>
            </div>
            <span class="order-price">$${(orderPrice * counter).toFixed(
              2
            )}</span>
          </div>
    `;
    orderConfirmed
      .querySelector(".orders-container")
      .insertAdjacentHTML("afterbegin", confirmedOrder);
  }
};

// Close confirmed orders window
const closeConfirmedOrder = function () {
  overlay.classList.add("hidden");
  orderConfirmed.classList.add("hidden");
};
