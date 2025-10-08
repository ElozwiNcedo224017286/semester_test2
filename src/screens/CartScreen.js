// src/screens/CartScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import { ref, onValue, remove, update } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CartScreen() {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const cartRef = ref(database, `carts/${user.uid}`);
    const unsub = onValue(cartRef, (snapshot) => {
      if (snapshot.exists()) {
        setCart(snapshot.val());
        AsyncStorage.setItem(`cart-${user.uid}`, JSON.stringify(snapshot.val()));
      } else {
        // fallback to local storage
        (async () => {
          const local = await AsyncStorage.getItem(`cart-${user.uid}`);
          setCart(local ? JSON.parse(local) : { items: {} });
        })();
      }
      setLoading(false);
    }, (err) => {
      // on error fallback to local
      (async () => {
        const local = await AsyncStorage.getItem(`cart-${user.uid}`);
        setCart(local ? JSON.parse(local) : { items: {} });
        setLoading(false);
      })();
    });
    return () => unsub();
  }, [user]);

  if (loading) return <Text>Loading cart...</Text>;

  const items = cart?.items ? Object.entries(cart.items) : [];

  const total = items.reduce((acc, [key, it]) => acc + (it.price * (it.quantity || 1)), 0);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={items}
        keyExtractor={([key]) => key}
        renderItem={({ item: [key, it] }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}>
            <Text>{it.title} x{it.quantity || 1}</Text>
            <Text>R{(it.price * (it.quantity || 1)).toFixed(2)}</Text>
            <Button title="Remove" onPress={() => remove(ref(database, `carts/${user.uid}/items/${key}`))} />
          </View>
        )}
      />
      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Total: R{total.toFixed(2)}</Text>
    </View>
  );
}
