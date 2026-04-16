'use client';
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("YOUR_PUBLIC_KEY");

export default function Home() {
  const [cart, setCart] = useState([]);

  const products = [
    {
      id: 1,
      name: "50ml Signature Bottle",
      description: "Perfect for everyday elegance",
      price: 120,
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f",
    },
    {
      id: 2,
      name: "100ml Signature Bottle",
      description: "For lasting impressions",
      price: 120,
      image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de",
    },
  ];

  const addToCart = (product) => setCart([...cart, product]);

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({
      lineItems: cart.map(item => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: 1,
      })),
      mode: "payment",
      successUrl: window.location.origin,
      cancelUrl: window.location.origin,
    });
  };

  return (
    <div style={{ fontFamily: "serif", padding: 20 }}>
      <h1>NTHABIS SCENT PERFUME</h1>

      <h2>Products</h2>
      {products.map(p => (
        <div key={p.id} style={{ marginBottom: 20 }}>
          <img src={p.image} width="200" />
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <p>${p.price}</p>
          <button onClick={() => addToCart(p)}>Add to Cart</button>
        </div>
      ))}

      <h2>Cart</h2>
      {cart.map((item, i) => (
        <div key={i}>
          {item.name} - ${item.price}
          <button onClick={() => removeFromCart(i)}>Remove</button>
        </div>
      ))}

      <h3>Total: ${total}</h3>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
}
