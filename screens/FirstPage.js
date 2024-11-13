import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const FirstPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={require('./../assets/Group.png')}
          style={styles.image}
        />
      </View>

      <Text style={styles.title}>Manage your </Text>
      <Text style={styles.title}>finances on-the-go</Text>
      <Text style={styles.subtitle}>Manage your finances anytime, anywhere with our budgeting app.</Text>

      <TouchableOpacity 
        style={styles.createAccountButton} 
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.createAccountButtonText}>Create An Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.googleButtonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.signInText}>Already a member? Sign In</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', 
  },
  imageContainer: {
    marginBottom: 5,
    marginTop: -39,
  },
  image: {
    width: 280, 
    height: 280,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#0A1931',
    marginBottom: -10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 50,
    marginTop: 25,
  },
  createAccountButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  createAccountButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  googleButton: {
    borderWidth: 1,
    borderColor: '#7d7d7d',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  googleButtonText: {
    color: '#7d7d7d',
    fontSize: 18,
  },
  signInText: {
    color: '#666666',
    fontSize: 16,
    marginTop: 20,
  },
});

export default FirstPage;
