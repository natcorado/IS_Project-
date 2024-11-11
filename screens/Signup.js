import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const Signup = ({ navigation }) => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = async () => {
      if (password !== confirmPassword) {
          Alert.alert("Error", "Passwords do not match");
          return;
      }
  
      try {
          const signupData = {
              nombre: nombre,
              correo: email,
              contrasena: password,
          };
          console.log("Data being sent:", signupData); 
  
          const response = await fetch('http://10.1.10.52/API/addUsuario.php', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(signupData),
          });
  
          const responseText = await response.text();
          console.log("Raw Response Text:", responseText);
  
          if (response.headers.get('content-type')?.includes('application/json')) {
              const jsonResponse = JSON.parse(responseText);
              console.log("Parsed JSON Response:", jsonResponse);
          
              if (jsonResponse.status === 'success') {
                  Alert.alert("Success", jsonResponse.message);
              } else {
                  Alert.alert("Error", jsonResponse.message || "Failed to sign up");
              }
  
          } else {
              Alert.alert("Error", "Unexpected server response: " + responseText);
          }
      } catch (error) {
          Alert.alert("Error", "An error occurred. Please try again later.");
          console.error("Fetch error:", error);
      }
    };
  
   
  

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Create password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Confirm password</Text>
        <TextInput
          style={styles.input}
          placeholder="Repeat password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignup}>
          <Text style={styles.signUpButtonText}>Create An Account</Text>
        </TouchableOpacity>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'left',
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 15,
  },
  signUpButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  signUpButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
  },
  label: {
      fontSize: 16,
      color: 'black',

  },
});

export default Signup;