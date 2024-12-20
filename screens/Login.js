import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    
    const handleLogin = async () => {
      try {
          const response = await fetch('http://10.10.10.74/API/loginUsuario.php', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  correo: email,
                  contrasena: password,
              }),
          });
  
          const rawText = await response.text();
          console.log("Raw Response Text:", rawText);
  
          const jsonResponse = JSON.parse(rawText);
          console.log("Parsed JSON Response:", jsonResponse);
  
          if (jsonResponse.success) {
            console.log("Parsed JSON Response:", jsonResponse);
            navigation.navigate('Home_budget', {
                id_usuario: jsonResponse.id,
                nombre: jsonResponse.nombre,
                patrimonio: jsonResponse.patrimonio,
                correo: jsonResponse.correo,
            });
        } else {
            Alert.alert("Login Failed", jsonResponse.error || "Invalid email or password");
        }
      } catch (error) {
          Alert.alert("Error", "An error occurred. Please try again.");
          console.error("Login error:", error);
      }
    }; 

  /*
    const handleLogin = async() =>{
        const jsonResponse = {
            success: true, 
            message: "Login exitoso",
            id: 1,
            nombre: "Kike Aragon", 
            patrimonio: 5000
        };

        if (jsonResponse.success) {
            console.log("Parsed JSON Response:", jsonResponse);
            navigation.navigate('Home_budget', {
                id_usuario: jsonResponse.id,
                nombre: jsonResponse.nombre,
                patrimonio: jsonResponse.patrimonio,
            });
        } else {
            Alert.alert("Login Failed", jsonResponse.error || "Invalid email or password");
        }
    };

*/

  
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="example@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                autoCapitalize="none"
            />

            <TouchableOpacity style={styles.signUpButton} onPress={handleLogin}>
                <Text style={styles.signUpButtonText}>Log in</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
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

export default Login;