import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from './../components/Footer';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { Picker } from '@react-native-picker/picker';
import Modal from './../components/Modal';


const Budget = ({ route }) => {
  const { id_usuario, nombre, patrimonio } = route.params;

  const [id_user, setId_user] = useState(id_usuario);
  const [name, setName] = useState(nombre);
  const [budget, setBudget] = useState(patrimonio); 

  const navigation = useNavigation();
  const [modalOpen, setModalOpen] = useState(false);
  const [isExpense, setIsExpense] = useState(true);

  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [date, setDate] = useState(new Date());
  const [comments, setComments] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  const categories = ['Category 1', 'Category 2', 'Category 3'];

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };


  const showDatepicker = () => {
    setShowPicker(true);
  };

  const handleAddCategory = () => {
    setModalOpen(true); 
  };

  const closeModal = () => {
    setModalOpen(false); 
  };

  return (
    <View style={styles.container}>
      {modalOpen && (
          <Modal isOpen={modalOpen} withInput>
              <View style={styles.modal}>
                  <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>
                        {isExpense ? "Add Category - Expenses": "Add Category - Income"}
                      </Text>
                      <Text style={styles.sectionLabel}>Categories</Text>
                      <TextInput
                          style={styles.modalInput}
                          placeholder="Enter category name"
                      />
                      <View style={styles.buttonRow}>
                          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                              <Text style={styles.closeButtonText}>Close</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.addButtonModal} onPress={() => Alert.alert('Add button pressed')}>
                              <Text style={styles.addButtonModalText}>Add</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
              </View>
          </Modal>
      )}
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Please,</Text>
          <Text style={styles.userName}>Add New Register</Text>
        </View>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, isExpense && styles.activeButton]}
            onPress={() => setIsExpense(true)}
          >
            <Text style={styles.toggleText}>Expenses</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !isExpense && styles.activeButton]}
            onPress={() => setIsExpense(false)}
          >
            <Text style={styles.toggleText}>Income</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.amountContainer}>
          <TextInput
            style={styles.amountInput}
            keyboardType="numeric"
            placeholder="0"
            value={amount}
            onChangeText={setAmount}
          />
          <Text style={styles.currencyText}>$</Text>
        </View>

        <Text style={styles.sectionLabel}>Categories</Text>
        <Picker
          selectedValue={selectedCategory}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        >
          {categories.map((category, index) => (
            <Picker.Item key={index} label={category} value={category} />
          ))}
        </Picker>

        <TouchableOpacity style={styles.addCategoryButton} onPress={handleAddCategory}>
          <Text style={styles.addCategoryButtonText}>+ Add Category</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Date</Text>
        <TouchableOpacity onPress={showDatepicker} style={styles.dateButton}>
          <Text>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            is24Hour={true}
          />
        )}

        <Text style={styles.sectionLabel}>Comments</Text>
        <TextInput
          style={styles.commentsInput}
          placeholder="Comments"
          value={comments}
          onChangeText={setComments}
          multiline
          numberOfLines={1}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>

        <View style={styles.space} />

      </ScrollView>
      <Footer navigation={navigation} id_usuario={id_user} nombre={name} patrimonio={budget} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  closeButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  addButtonModal: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  addButtonModalText: {
    color: '#fff',
    fontSize: 16
  },
  header: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#000',
  },
  toggleText: {
    color: '#fff',
    fontSize: 16,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  amountInput: {
    fontSize: 36,
    textAlign: 'center',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  currencyText: {
    fontSize: 36,
    marginLeft: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  commentsInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  addCategoryButton: {
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  addCategoryButtonText: {
    fontSize: 16,
    color: 'gray',
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  space: {
    marginBottom: 100,
  },
});

export default Budget;
