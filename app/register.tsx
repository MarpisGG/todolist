import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { initializeApp, getApps, getApp } from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBm33UjQHf88HT7H0Ym6Ipz_mE7g2XVMBI",
    authDomain: "coba-7629a.firebaseapp.com",
    projectId: "coba-7629a",
    storageBucket: "coba-7629a.appspot.com",
    messagingSenderId: "528328929295",
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);


const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();

    // Configure Google Auth Request
    const [, response, promptAsync] = Google.useAuthRequest({
        clientId: '528328929295-ss44vsrvjmqg6g0r1h1p25o2msgt4o85.apps.googleusercontent.com',
        androidClientId: '528328929295-2f58s3m7pq61k6sc8bmo4pa3hcqg41vt.apps.googleusercontent.com',
        iosClientId: '528328929295-onkj5dehs87mqr4trjobg3od6ea5guqr.apps.googleusercontent.com',
        scopes: ['email', 'profile', 'openid'],
        redirectUri: 'https://auth.expo.io/@marpis/tes',
    });
    

    useEffect(() => {
        if (response?.type === 'success') {
            const { access_token } = response.params; // Get the access token
    
            if (access_token) {
                // Use the access token to sign in with Firebase
                const credential = GoogleAuthProvider.credential(null, access_token);
    
                signInWithCredential(auth, credential)
                    .then((userCredential) => {
                        Alert.alert('Success', 'User signed in with Google!');
                        console.log('User signed in:', userCredential.user);
                        router.push('/coba');
                    })
                    .catch((error) => {
                        console.error('Error signing in with Google:', error);
                        setError('Error signing in with Google. Please try again.');
                    });
            }
        }
    }, [response]);

    const handleRegister = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert('Success', 'User registered successfully!');
            router.push('/coba');
        } catch (error: any) {
            setError('Error registering user. Please try again.');
        }
    };

    const startGoogleSignIn = () => {
        promptAsync();
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
    <Text
      style={{
        fontSize: 45,
        fontFamily: 'BebasNeue-Regular',
        marginBottom: 20,
        color: '#1c536c',
      }}
    >
      R e g i s t e r
    </Text>
  </View>

  <TextInput
    placeholder="Email"
    value={email}
    onChangeText={setEmail}
    keyboardType="email-address"
    autoCapitalize="none"
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
  {error && (
    <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>
      {error}
    </Text>
  )}

  <TouchableOpacity onPress={handleRegister}
          style={{
            backgroundColor: '#131c22',
            padding: 10,
            borderRadius: 5,
            width: '80%',
            alignItems: 'center',
            marginTop : 10,
            marginBottom : 10
          }}>
      <Text style={{ color: 'white' }}>Register</Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => router.push('/')}>
    <View
      style={{
        padding: 10,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
        marginBottom: 10,
      }}
    >
      <Text style={{ color: '#5c90ac' }}>
        Already have an account? Login
      </Text>
    </View>
  </TouchableOpacity>

  {/* <Text style={{ textAlign: 'center', marginTop: 16 }}>or register with</Text>
  <TouchableOpacity onPress={startGoogleSignIn}>
    <View
      style={{
        backgroundColor: '#db4437',
        padding: 10,
        borderRadius: 5,
        width: '80%',
        alignItems: 'center',
        marginTop: 10,
      }}
    >
      <Text style={{ color: 'white' }}>Register with Google</Text>
    </View>
  </TouchableOpacity> */}
</View>

    );
};


export default Register;
