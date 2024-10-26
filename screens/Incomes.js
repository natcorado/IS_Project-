import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Footer from '../components/Footer';
import AddButton from '../components/AddButton';
import Icon from 'react-native-vector-icons/FontAwesome';


const Incomes = () => {
  const navigation = useNavigation();
  const route = useRoute(); 
  const { type } = route.params; 

  const transactions = [
    { id: '1', title: 'Spotify', date: 'Dec 15, 2023', amount: '-$199', isPositive: false },
    { id: '2', title: 'Netflix', date: 'Jan 01, 2023', amount: '-$649', isPositive: false },
    { id: '3', title: 'Upwork', date: 'Feb 12, 2024', amount: '+$1445.90', isPositive: true },
    { id: '4', title: 'Spotify', date: 'Dec 15, 2023', amount: '-$199', isPositive: false },
  ];

  //filtros por categoria
  //filtros por meses 

  const filteredTransactions = transactions.filter(item =>
    type === 'incomes' ? item.isPositive : !item.isPositive
  );

  const renderTransactionItem = ({ item }) => {
    let iconName;
    switch (item.title) {
      case 'Spotify':
        iconName = 'spotify';
        break;
      case 'Netflix':
        iconName = 'film'; 
        break;
      case 'Upwork':
        iconName = 'briefcase';
        break;
      default:
        iconName = 'credit-card';
    }

    return (
      <View style={styles.transactionContainer}>
        <View style={styles.iconContainer}>
          <Icon name={iconName} size={24} color="#000" />
        </View>

        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionDate}>{item.date}</Text>
        </View>
        <Text style={[styles.transactionAmount, { color: item.isPositive ? 'green' : 'red' }]}>
          {item.amount}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{type === 'incomes' ? 'Incomes' : 'Outcomes'}</Text>
      
      <View style={styles.filterSection}>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              styles.activeButton
            ]}

          >
          
            <Text style={styles.buttonText}>Category</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              styles.activeButton
            ]}
          >
            <Text style={styles.buttonText}>Outcome</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={item => item.id}
        ListFooterComponent={<Footer navigation={navigation} />}
      />

      <AddButton />
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    marginVertical: 5,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#d3d3d3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  transactionDate: {
    color: '#666',
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterSection: {
    marginBottom: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
});

export default Incomes;
