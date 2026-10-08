import React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  createOrder as createOrderRequest,
  getMyOrders,
} from "../services/orderApi";

const StoreContext = createContext(null);
const ORDERS_KEY = "spark-orders";

function readStorage(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function discountedPrice(product) {
  return Number(
    (product.price * (1 - (product.discountPercentage || 0) / 100)).toFixed(2),
  );
}

export function StoreProvider({ children }) {
  const { user } = useAuth();
  const ownerKey = user?.id || "guest";
  const cartKey = `spark-cart-${ownerKey}`;
  const wishlistKey = `spark-wishlist-${ownerKey}`;

  const [cart, setCart] = useState(() => readStorage(cartKey));
  const [wishlist, setWishlist] = useState(() => readStorage(wishlistKey));
  const [orders, setOrders] = useState(() => readStorage(ORDERS_KEY));

  useEffect(() => {
    setCart(readStorage(cartKey));
    setWishlist(readStorage(wishlistKey));
  }, [cartKey, wishlistKey]);

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
    window.dispatchEvent(new Event("storage"));
  }, [cart, cartKey]);

  useEffect(() => {
    localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
  }, [wishlist, wishlistKey]);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      window.location.assign("/login");
      return false;
    }
    const prodId = product.id || product._id;

    setCart((current) => {
      const existingIndex = current.findIndex(
        (item) =>
          (item.product?.id || item.product?._id || item.id || item._id) ===
          prodId,
      );

      let updatedCart = [...current];

      if (existingIndex > -1) {
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: Math.min(
            updatedCart[existingIndex].quantity + quantity,
            product.stock || 99,
          ),
        };
      } else {
        updatedCart.push({
          product,
          quantity: Math.min(quantity, product.stock || 99),
        });
      }

      return updatedCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCart((current) => {
      return current.map((item) => {
        const currentId =
          item.product?.id || item.product?._id || item.id || item._id;
        return currentId === productId
          ? {
              ...item,
              quantity: Math.max(
                1,
                Math.min(quantity, item.product?.stock || item.stock || 99),
              ),
            }
          : item;
      });
    });
  };

  const removeFromCart = (productId) => {
    setCart((current) => {
      return current.filter((item) => {
        const currentId =
          item.product?.id || item.product?._id || item.id || item._id;
        return currentId !== productId;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product) => {
    setWishlist((current) => {
      const exists = current.some((item) => item.id === product.id);
      return exists
        ? current.filter((item) => item.id !== product.id)
        : [...current, product];
    });
  };

  const isWishlisted = (id) => wishlist.some((item) => item.id === id);

  const createOrder = async ({
    customer,
    address,
    paymentMethod,
    promoCode,
    discount,
    loyaltyPointsRedeemed = 0,
  }) => {
    const subtotal = cart.reduce(
      (sum, item) =>
        sum + discountedPrice(item.product || item) * item.quantity,
      0,
    );
    const shipping = subtotal >= 100 ? 0 : 12;
    const total = Math.max(0, subtotal + shipping - discount);
    if (user) {
      const order = await createOrderRequest({
        customer,
        address,
        paymentMethod,
        promoCode,
        discount,
        loyaltyPointsRedeemed,
        items: cart,
      });
      setOrders((current) => [
        order,
        ...current.filter((item) => item._id !== order._id),
      ]);
      clearCart();
      return order;
    }
    const order = {
      id: `SPK-${Date.now().toString().slice(-8)}`,
      userId: null,
      customer,
      address,
      paymentMethod,
      promoCode: promoCode || null,
      items: cart,
      subtotal: Number(subtotal.toFixed(2)),
      shipping,
      discount,
      total: Number(total.toFixed(2)),
      status: "Confirmed",
      createdAt: new Date().toISOString(),
      tracking: {
        courier: "Spark Courier",
        progress: 1,
        eta: "Today, 1:30–2:00 PM",
      },
    };
    setOrders((current) => [order, ...current]);
    clearCart();
    return order;
  };

  useEffect(() => {
    if (!user) return;
    getMyOrders()
      .then(setOrders)
      .catch(() => {});
  }, [user]);

  const customerOrders = (orders || []).filter(
    (order) => String(order.user || order.userId) === String(user?.id),
  );

  const cartCount = cart.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0,
  );

  const subtotal = cart.reduce(
    (sum, item) => sum + discountedPrice(item.product || item) * item.quantity,
    0,
  );
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 12;

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      orders,
      customerOrders,
      cartCount,
      subtotal: Number(subtotal.toFixed(2)),
      shipping,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      isWishlisted,
      createOrder,
      discountedPrice,
    }),
    [cart, wishlist, orders, customerOrders, cartCount, subtotal, shipping],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
