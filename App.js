// App.js
import React from 'react';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext'; // ✅ import the CartProvider
import AppNavigator from './src/AppNavigator';

function MainApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return <AppNavigator user={user} />;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider> 
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
