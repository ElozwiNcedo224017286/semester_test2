import React, { createContext, useState, useEffect, useContext } from "react";
import { ref, set, get, onValue, remove } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../firebase";
import { useAuth } from "./AuthContext"; 

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user } = useAuth(); 
  const [cart, setCart] = useState([]);

  
  useEffect(() => {
    if (!user) return;

    const cartRef = ref(db, `carts/${user.uid}`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const items = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setCart(items);
        AsyncStorage.setItem("cart", JSON.stringify(items)); 
      } else {
        setCart([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  
  const addToCart = async (product) => {
    if (!user) return;
    const cartRef = ref(db, `carts/${user.uid}/${product.id}`);
    await set(cartRef, product);
  };


  const removeFromCart = async (productId) => {
    if (!user) return;
    const itemRef = ref(db, `carts/${user.uid}/${productId}`);
    await remove(itemRef);
  };

  
  useEffect(() => {
    const loadLocalCart = async () => {
      const storedCart = await AsyncStorage.getItem("cart");
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    };
    loadLocalCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}
