import React, {useState} from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AddButton = ({id_usuario, nombre, patrimonio }) => {

  const [id_user, setId_user] = useState(id_usuario);
  const [name, setName] = useState(nombre);
  const [budget, setBudget] = useState(patrimonio); 
  const navigation = useNavigation(); 

  return (
    <TouchableOpacity 
      style={styles.addButton}
      onPress={() => {
        navigation.navigate('Budget', {
          id_usuario: id_user,
          nombre: name,
          patrimonio: budget,
        });
      }}
    >
      <FontAwesome name="plus" size={24} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  addButton: {
    position: 'absolute',
    bottom: 90,
    right: 40,
    backgroundColor: '#000',
    borderRadius: 40,
    padding: 11,
  },
});

export default AddButton;