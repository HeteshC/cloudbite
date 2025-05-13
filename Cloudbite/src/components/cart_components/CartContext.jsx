import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth_components/AuthManager";
import axios from "axios";
import globalBackendRoute from "../../config/config";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isLoggedIn, user, loading } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState(() => {
    const guestCart = localStorage.getItem("guest_cart");
    if (guestCart) {
      try {
        const parsed = JSON.parse(guestCart);
        if (parsed.expiry > Date.now()) {
          return parsed.cart || [];
        }
      } catch {
        console.error("Invalid guest cart");
      }
    }
    return [];
  });

  const [cartLoading, setCartLoading] = useState(true);
  const [syncDone, setSyncDone] = useState(false);

  // 🔁 Re-trigger cart sync when user logs in
  useEffect(() => {
    if (loading) return;
    setSyncDone(false);
  }, [isLoggedIn, user?.id, loading]);

  useEffect(() => {
    if (loading || syncDone) return;

    const handleCartLoad = async () => {
      if (isLoggedIn && user) {
        const guestCart = localStorage.getItem("guest_cart");
        if (guestCart) {
          try {
            const parsed = JSON.parse(guestCart);
            if (parsed.expiry > Date.now() && parsed.cart?.length > 0) {
              const serverCart = await fetchServerCartRaw();
              if (serverCart.length === 0) {
                await syncGuestCartToServer(parsed.cart);
              }
              localStorage.removeItem("guest_cart");
            } else {
              localStorage.removeItem("guest_cart");
              await fetchServerCart();
            }
          } catch (err) {
            console.warn("Guest cart parse error", err);
            localStorage.removeItem("guest_cart");
            await fetchServerCart();
          }
        } else {
          await fetchServerCart();
        }
      } else {
        setCartLoading(false);
      }

      setSyncDone(true);
    };

    handleCartLoad();
  }, [isLoggedIn, user, loading, syncDone]);

  useEffect(() => {
    if (!isLoggedIn) {
      const payload = {
        cart: cartItems,
        expiry: Date.now() + 7 * 24 * 60 * 60 * 1000,
      };
      localStorage.setItem("guest_cart", JSON.stringify(payload));
    }
  }, [cartItems, isLoggedIn]);

  useEffect(() => {
    const handleStorageChange = () => {
      if (!isLoggedIn) {
        const guestCart = localStorage.getItem("guest_cart");
        if (guestCart) {
          try {
            const parsed = JSON.parse(guestCart);
            if (parsed.expiry > Date.now()) {
              setCartItems(parsed.cart || []);
            }
          } catch {}
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isLoggedIn]);

  const fetchServerCartRaw = async () => {
    try {
      const { data } = await axios.get(
        `${globalBackendRoute}/api/get-cart-items`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return data.items || [];
    } catch (error) {
      console.error("Failed to fetch raw server cart:", error.message);
      return [];
    }
  };

  const fetchServerCart = async () => {
    try {
      setCartLoading(true);
      const items = await fetchServerCartRaw();
      setCartItems(items);
    } finally {
      setCartLoading(false);
    }
  };

  const syncGuestCartToServer = async (cart) => {
    try {
      await axios.post(
        `${globalBackendRoute}/api/sync-cart`,
        { items: cart },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Guest cart synced to server!");
    } catch (error) {
      console.error("Error syncing guest cart:", error.message);
    }
  };

  const addToCart = async (product) => {
    try {
      if (!product || !product._id) {
        throw new Error("Invalid product data. Food ID is required.");
      }

      console.log("Adding product to cart:", product); // Log the product being added

      if (isLoggedIn) {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User is not authenticated.");
        }

        const response = await axios.post(
          `${globalBackendRoute}/api/add-to-cart`,
          { foodId: product._id, quantity: 1 }, // Ensure correct payload
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update cart state with the new cart data from the server
        setCartItems(response.data.items || []);
      } else {
        // Handle guest cart
        setCartItems((prev) => {
          const existingItem = prev.find((item) => item._id === product._id);
          if (existingItem) {
            return prev.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            return [...prev, { ...product, quantity: 1 }];
          }
        });
      }

      // Show only one toast message with the product name
      toast.success(`${product.product_name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error); // Log the error for debugging
      toast.error("Failed to add item to cart.");
    }
  };

  const removeFromCart = async (productId) => {
    if (isLoggedIn) {
      try {
        const item = cartItems.find((item) => item._id === productId);
        if (item && item.quantity > 1) {
          // Decrement quantity if more than 1
          await axios.patch(
            `${globalBackendRoute}/api/update-cart/${productId}`,
            { quantity: item.quantity - 1 },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          fetchServerCart(); // Refresh the cart after update
          toast.success("Item quantity updated!");
        } else {
          // Remove item completely if quantity is 1
          await axios.delete(
            `${globalBackendRoute}/api/remove-cart-item/${productId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          fetchServerCart(); // Refresh the cart after removal
          toast.success("Item removed from cart!");
        }
      } catch (error) {
        console.error("Failed to remove item:", error.message);
        toast.error("Failed to update cart!");
      }
    } else {
      setCartItems((prev) => {
        const existingItem = prev.find((item) => item._id === productId);
        if (existingItem && existingItem.quantity > 1) {
          // Decrement quantity if more than 1
          return prev.map((item) =>
            item._id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
        } else {
          // Remove item completely if quantity is 1
          return prev.filter((item) => item._id !== productId);
        }
      });
      toast.success("Cart updated!");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (isLoggedIn) {
      try {
        await axios.patch(
          `${globalBackendRoute}/api/update-cart/${productId}`,
          { quantity },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        fetchServerCart();
        toast.success("Cart updated!");
      } catch (error) {
        console.error("Failed to update item:", error.message);
        toast.error("Failed to update!");
      }
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        )
      );
      toast.success("Cart updated!");
    }
  };

  const clearCart = async () => {
    try {
      if (isLoggedIn) {
        await axios.delete(`${globalBackendRoute}/api/clear-cart`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
      setCartItems([]);
      localStorage.removeItem("guest_cart");
      toast.success("Cart cleared!");
    } catch (error) {
      console.error("Failed to clear cart!", error.message);
      toast.error("Failed to clear cart!");
    }
  };

  const resetCartState = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchServerCart,
        resetCartState,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
