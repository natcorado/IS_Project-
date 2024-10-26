import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from './../components/Footer';
import AddButton from './../components/AddButton';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import DateTimePicker from '@react-native-community/datetimepicker'; 

const Budget = () => {
  const navigation = useNavigation();
  const [isExpense, setIsExpense] = useState(true);
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [date, setDate] = useState(new Date());
  const [comments, setComments] = useState('');
  const [showPicker, setShowPicker] = useState(false); 

  const categories = ['Category 1', 'Category 2', '+'];

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowPicker(true); 
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
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
        <FlatList
          data={categories}
          horizontal
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.activeCategory,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item && styles.activeCategoryText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoryList}
        />

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

        {/* Comments Input */}
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
      
      </ScrollView>
      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
    marginVertical: 10,
    flexGrow: 1,
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
  categoryButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  activeCategory: {
    backgroundColor: '#000',
  },
  categoryText: {
    color: '#000',
    fontSize: 16,
  },
  activeCategoryText: {
    color: '#fff',
  },
  dateButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default Budget;