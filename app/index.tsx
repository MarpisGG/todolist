import React, { useState } from 'react';
import { Button, TextInput, View, Alert, Text, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';


// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyBm33UjQHf88HT7H0Ym6Ipz_mE7g2XVMBI',
  authDomain: 'coba-7629a.firebaseapp.com',
  projectId: 'coba-7629a',
  storageBucket: 'coba-7629a.appspot.com',
  messagingSenderId: '528328929295',
  appId: '1:528328929295:android:5c0d4b8a29bfa1688cb37a',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Index() {
  const [fontsLoaded] = useFonts({
    'BebasNeue-Regular': require('../assets/fonts/Bebas_Neue/BebasNeue-Regular.ttf'),
  });

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful'); // Log success to console
      Alert.alert('Success', 'Login successful')
      router.push('/coba');
    } catch (error) {
      console.log('Login failed', error); // Log error to console
      Alert.alert('Error', 'Login failed');
    }
  };

  return (
    <View
      style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      padding: 20,
      }}
    >
    <View style={{ alignItems: 'flex-start' }}>
      <Text style={{ 
      fontSize: 45, 
      fontFamily: 'BebasNeue-Regular',
      color: '#1c536c' }}>T o </Text>
      <Text style={{ 
      fontSize: 45, 
      fontFamily: 'BebasNeue-Regular',
      color: '#1c536c' }}>D o</Text>
      <Text style={{ 
      fontSize: 45,
      fontFamily: 'BebasNeue-Regular',
      color: '#1c536c' }}>L  i s t</Text>
      <Text style={{ 
      fontSize: 45,
      marginBottom: 20, 
      fontFamily: 'BebasNeue-Regular',
      color: '#1c536c' }}>A p p</Text>
    </View>

    <TextInput
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
      style={{
        height: 40,
        borderColor: '#1c536c',
        borderWidth: 1,
        marginBottom: 10,
        width: '80%',
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderRadius: 5,
      }}
      />
      <TextInput
      placeholder="Password"
      value={password}
      onChangeText={setPassword}
      secureTextEntry
      style={{
        height: 40,
        borderColor: '#1c536c',
        borderWidth: 1,
        marginBottom: 10,
        width: '80%',
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderRadius: 5,
      }}
      />
      <TouchableOpacity onPress={handleLogin}
        style={{
          backgroundColor: '#131c22',
          padding: 10,
          borderRadius: 5,
          width: '80%',
          alignItems: 'center',
          marginTop : 10,
          marginBottom : 10
        }}> 
        <Text style={{ color: 'white' }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
          router.push('/register'); // Navigate to register screen
        }}> 
        <View
          style={{
            padding: 10,
            borderRadius: 5,
            width: '80%',
            alignItems: 'center',
            marginBottom : 10,
          }}
        >
        <Text style={{ color: '#5c90ac' }}>Don't Have Account? Sign Up Here</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
