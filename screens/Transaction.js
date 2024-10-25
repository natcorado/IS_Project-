import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from './../components/Footer';
import AddButton from './../components/AddButton';
import Icon from 'react-native-vector-icons/FontAwesome'; // Asegúrate de instalar esta librería

const Transaction = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('Narendra Modi');
  const [budget, setBudget] = useState(25890);

  // Datos de ejemplo para las transacciones
  const transactions = [
    { id: '1', title: 'Spotify', date: 'Dec 15, 2023', amount: '-$199', isPositive: false },
    { id: '2', title: 'Netflix', date: 'Jan 01, 2023', amount: '-$649', isPositive: false },
    { id: '3', title: 'Upwork', date: 'Feb 12, 2024', amount: '+$1445.90', isPositive: true },
    { id: '4', title: 'Spotify', date: 'Dec 15, 2023', amount: '-$199', isPositive: false },
  ];

  const renderTransactionItem = ({ item }) => {
    // Determina el ícono basado en el título
    let iconName;
    switch (item.title) {
      case 'Spotify':
        iconName = 'spotify';
        break;
      case 'Netflix':
        iconName = 'film'; // Puedes usar 'netflix' si está disponible en tu pack de íconos
        break;
      case 'Upwork':
        iconName = 'briefcase';
        break;
      default:
        iconName = 'credit-card'; // Un ícono genérico para otras transacciones
    }

    return (
      <View style={styles.transactionContainer}>
        {/* Cuadro gris con el ícono */}
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
      {/* Sección no desplazable del encabezado */}
      <FlatList
        data={transactions}
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
              <View style={styles.budgetButtonsContainer}>
                {/* Agrega botones si es necesario */}
              </View>
            </View>

            <Text style={styles.recentTransactionsText}>Recent Transaction</Text>

            <View style={styles.filterSection}>
              <Text style={styles.filterText}>Filter</Text>
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
  budgetButtonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterText: {
    color: '#000',
    fontSize: 14,
  },
});

export default Transaction;