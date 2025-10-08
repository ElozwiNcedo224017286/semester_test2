// src/screens/ProductListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Button } from 'react-native';

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);

  const fetchProducts = async (cat=null) => {
    setLoading(true);
    const url = cat ? `https://fakestoreapi.com/products/category/${encodeURIComponent(cat)}` : 'https://fakestoreapi.com/products';
    const res = await fetch(url);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const cRes = await fetch('https://fakestoreapi.com/products/categories');
      setCats(await cRes.json());
      await fetchProducts();
    })();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', padding: 8 }}>
        <Button title="All" onPress={() => { setCategory(null); fetchProducts(); }} />
        {cats.map(c => (
          <Button key={c} title={c} onPress={() => { setCategory(c); fetchProducts(c); }} />
        ))}
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })} style={{ flexDirection: 'row', padding: 10 }}>
            <Image source={{ uri: item.image }} style={{ width: 80, height: 80 }} />
            <View style={{ marginLeft: 10, flex:1 }}>
              <Text numberOfLines={1}>{item.title}</Text>
              <Text>R{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
