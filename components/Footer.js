import React, {useState} from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Footer = ({ navigation, id_usuario, nombre, correo, patrimonio }) => {

  const [id_user, setId_user] = useState(id_usuario);
  const [name, setName] = useState(nombre);
  const [email, setEmail] = useState(correo);
  const [budget, setBudget] = useState(patrimonio); 
  
  const handleEmail= () => {
    console.log('Email:', budget );  
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => {
          handleEmail();
          navigation.navigate('Home_budget', {
            id_usuario: id_user,
            nombre: name,
            correo: email,
            patrimonio: budget,
          });
        }}
      >
        <FontAwesome name="home" size={24} color="black" />
        <Text>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => {
          handleEmail();
          navigation.navigate('Transaction', {
            id_usuario: id_user,
            nombre: name,
            correo: email,
            patrimonio: budget,
          });
        }}
      >
        <FontAwesome name="exchange" size={24} color="black" />
        <Text>Transaction</Text> 
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => {
          handleEmail();
          navigation.navigate('Home', {
            id_usuario: id_user,
            nombre: name,
            correo: email,
            patrimonio: budget,           
          });
        }}
      >
        <FontAwesome name="bar-chart" size={24} color="black" />
        <Text>Budget</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.footerButton}
        onPress={() => {
          handleEmail();
          navigation.navigate('Account', {
            id_usuario: id_user,
            nombre: name,
            correo: email,
            patrimonio: budget,
          });
        }}
      >
        <FontAwesome name="user" size={24} color="black" />
        <Text>Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 17,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  footerButton: {
    alignItems: 'center',
  },
});

export default Footer;