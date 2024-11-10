import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const AddButton = () => {
  const navigation = useNavigation(); 

  return (
    <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Budget')}>
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