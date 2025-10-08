// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const login = async () => {
    setErr('');
    if (!email || !password) { setErr('Fill all fields'); return; }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      {err ? <Text style={{ color: 'red' }}>{err}</Text> : null}
      <Button title="Login" onPress={login} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}
