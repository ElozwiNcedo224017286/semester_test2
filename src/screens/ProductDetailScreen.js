
import React, { useState } from 'react';
import { View, Text, Image, Button, Alert } from 'react-native';
import { ref, set, get, child, push, update } from 'firebase/database';
import { database } from '../firebase';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProductDetailScreen({ route }) {
  const { product } = route.params;
  const { user } = useAuth();
  const [qty, setQty] = useState(1);

  const addToCart = async () => {
    if (!user) { Alert.alert('Login required'); return; }
    const cartRef = ref(database, `carts/${user.uid}/items`);
    const newItemRef = push(cartRef);
    await set(newItemRef, {
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: qty,
    });
    await saveCartLocal();
    Alert.alert('Added to cart');
  };

  const saveCartLocal = async () => {
    try {
      const q = ref(database, `carts/${user.uid}`);
      const snap = await get(q);
      if (snap.exists()) {
        await AsyncStorage.setItem(`cart-${user.uid}`, JSON.stringify(snap.val()));
      }
    } catch (e) {}
  };

  return (
    <View style={{ padding: 16 }}>
      <Image source={{ uri: product.image }} style={{ width: 200, height: 200 }} />
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{product.title}</Text>
      <Text>{product.description}</Text>
      <Text>R{product.price}</Text>
      <Button title="Add to Cart" onPress={addToCart} />
    </View>
  );
}
