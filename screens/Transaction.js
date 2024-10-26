import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from './../components/Footer';
import AddButton from './../components/AddButton';
import Icon from 'react-native-vector-icons/FontAwesome';

const Transaction = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('Narendra Modi');
  const [budget, setBudget] = useState(25890);
  
  const [filterType, setFilterType] = useState('All'); 

  const transactions = [
    { id: '1', title: 'Spotify', date: 'Dec 15, 2023', amount: '-$199', isPositive: false },
    { id: '2', title: 'Netflix', date: 'Jan 01, 2023', amount: '-$649', isPositive: false },
    { id: '3', title: 'Upwork', date: 'Feb 12, 2024', amount: '+$1445.90', isPositive: true },
    { id: '4', title: 'Spotify', date: 'Dec 15, 2023', amount: '-$199', isPositive: false },
  ];

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

  const filteredTransactions = transactions.filter(transaction => {
    if (filterType === 'Incomes') return transaction.isPositive;
    if (filterType === 'Outcomes') return !transaction.isPositive;
    return true;
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.greeting}>Good Evening,</Text>
              <Text style={styles.userName}>{name}</Text>
            </View>

            <View style={styles.balanceCard}>
              <Text style={styles.balanceText}>My Budget:</Text>
              <Text style={styles.balanceAmount}>${budget.toLocaleString()}</Text>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.recentTransactionsText}>Recent Transactions</Text>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    filterType === 'Incomes' && styles.activeButton
                  ]}
                  onPress={() => setFilterType('Incomes')}
                >
                  <Text style={styles.buttonText}>Income</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    filterType === 'Outcomes' && styles.activeButton
                  ]}
                  onPress={() => setFilterType('Outcomes')}
                >
                  <Text style={styles.buttonText}>Outcome</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
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
  greeting: {
    fontSize: 16,
    color: '#333',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  balanceCard: {
    backgroundColor: '#161616',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
  },
  balanceText: {
    color: '#ccc',
    fontSize: 16,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  recentTransactionsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginVertical: 5,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'gray',
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
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
  activeButton: {
    backgroundColor: '#ddd',
  },
});

export default Transaction;