"use strict";

const cardContainer = document.querySelector(".card-container");
const cart = document.querySelector(".cart");
const emptyCart = document.querySelector(".empty-cart");
const cartOrderContainer = document.querySelector(".cart-orders-container");
const orderConfirmed = document.querySelector(".order-confirmed");
const newOrderBtn = document.querySelector(".btn-new-order");
const overlay = document.querySelector(".overlay");

let totalPrice = 0;

// Add orders to cart
cardContainer.addEventListener("click", (e) => {
  if (e.target.closest(".btn-add-to-cart")) {
    const button = e.target.closest(".btn-add-to-cart");
    addOrder(button);
    clickedAddCartStyle(button);
    updateCartNumber();
  }
});

// Increment
cardContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("increment")) {
    let { cartCounter, counter, order, priceEach } = incDecVars(e);

    counter++;
    totalPrice += priceEach;

    order.querySelector(".order-counter").textContent = `${counter}x`;
    order.querySelector(".order-price").textContent = `$${(
      priceEach * counter
    ).toFixed(2)}`;

    cartOrderContainer.nextElementSibling.querySelector(
      ".order-total-price"
    ).textContent = `$${totalPrice.toFixed(2)}`;

    cartCounter.textContent = counter;
    updateCartNumber();
  }
});

// Decrement
cardContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("decrement")) {
    let { cartCounter, counter, nameID, order, priceEach } = incDecVars(e);

    totalPrice -= priceEach;

    if (counter === 1) {
      removeOrder(order, nameID);
      updateCartNumber();
    } else {
      counter--;
      order.querySelector(".order-counter").textContent = `${counter}x`;
      order.querySelector(".order-price").textContent = `$${(
        priceEach * counter
      ).toFixed(2)}`;

      updateTotalPrice();

      cartCounter.textContent = counter;
      updateCartNumber();
    }
  }
});

// Add-to-cart hover effect
cardContainer.addEventListener("mouseover", (e) => {
  const cardBtn = e.target.closest(".btn-add-to-cart");
  if (cardBtn) {
    cardBtn.classList.add("btn-add-to-cart-hover");
  }
});
cardContainer.addEventListener("mouseout", (e) => {
  const cardBtn = e.target.closest(".btn-add-to-cart");
  if (cardBtn) {
    cardBtn.classList.remove("btn-add-to-cart-hover");
  }
});

// Remove 1 order from cart
cartOrderContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-order-remove")) {
    const order = e.target.parentElement;
    const nameID = e.target.closest(".order").id;
    const price = Number(
      order.querySelector(".order-price").textContent.slice(1)
    );
    totalPrice -= price;
    updateTotalPrice();
    removeOrder(order, nameID);
    updateCartNumber();
  }
});

// Confirm order
cart.addEventListener("click", (e) => {
  orderConfirmed.querySelector(".orders-container").innerHTML = "";
  if (e.target.classList.contains("btn-confirm-order")) {
    overlay.classList.remove("hidden");
    orderConfirmed.classList.remove("hidden");

    const orders = [...cartOrderContainer.querySelectorAll(".order")];
    createConfirmedOrders(orders);

    orderConfirmed.querySelector(
      ".order-total-price"
    ).textContent = `$${totalPrice.toFixed(2)}`;
  }
});

// Reset All
newOrderBtn.addEventListener("click", () => {
  cartOrderContainer.innerHTML = "";
  cartOrderContainer.nextElementSibling.remove();
  emptyCart.style.display = "block";
  emptyCart.previousElementSibling.style.display = "initial";
  const cards = [...cardContainer.querySelectorAll(".card")];
  for (const card of cards) {
    const nameID = card.id;
    if (nameID) {
      defaultAddCardStyle(nameID);
    }
  }
  totalPrice = 0;
  closeConfirmedOrder();
  updateCartNumber();
});

// Close overlay
overlay.addEventListener("click", () => {
  closeConfirmedOrder();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeConfirmedOrder();
  }
});
