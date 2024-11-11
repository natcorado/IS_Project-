import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from './../components/Footer';
import AddButton from './../components/AddButton';
import Icon from 'react-native-vector-icons/FontAwesome';



const Transaction = ({ route }) => {

  const { id_usuario, nombre, correo, patrimonio } = route.params;
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);

  const [id_user, setId_user] = useState(id_usuario);
  const [name, setName] = useState(nombre);
  const [email, setEmail] = useState(correo); 
  const [budget, setBudget] = useState(patrimonio);
  const [filterType, setFilterType] = useState('All'); 

  useEffect(() => {
    handleBoth();
  }, []);

  const handleBoth = async () => {
    try {
      const response = await fetch('http://10.10.10.74/API/getIncomesAndOutcomes.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_usuario: id_usuario,
            Income_Outcome: 2,
          }),
      });

      const rawText = await response.text();
      console.log("Raw Response Text:", rawText);

      const jsonResponse = JSON.parse(rawText);
      console.log("Parsed JSON Response:", jsonResponse);

      if (jsonResponse.status === "success") {
        const formattedTransactions = jsonResponse.data.map(item => ({
          id: item.id_reporte.toString(),
          title: item.categoria,
          date: new Date(item.fecha).toLocaleDateString(),
          amount: (item.tipo_reporte === 'Ingreso' ? '' : '-') + `$${Math.abs(item.cantidad)}`,
          isPositive: item.tipo_reporte === 'Ingreso'
        }));

        setTransactions(formattedTransactions);
      } else {
        Alert.alert("Error", jsonResponse.error || "Failed to retrieve data");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

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

  const toggleFilter = (filter) => {
    if (filter === filterType) {
      setFilterType('All'); 
    } else {
      setFilterType(filter); 
    }
  };

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
              <Text style={styles.balanceAmount}>${budget ? budget.toLocaleString() : '0.00'}</Text>
            </View>

            <View style={styles.filterSection}>
              <View style={styles.cardContent}>
                <Text style={styles.recentTransactionsText}>Recent Transactions</Text>

                <TouchableOpacity 
                  style={styles.detailsButton}
                  onPress={() => navigation.navigate('Incomes', { 
                    id_usuario: id_user, 
                    nombre: name, 
                    correo: email, 
                    patrimonio: budget 
                  })} 
                >
                  <Text style={styles.detailsButtonText}>See More</Text>
                </TouchableOpacity>

              </View>

              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    filterType === 'Incomes' && styles.activeButton
                  ]}
                  onPress={() => toggleFilter('Incomes')}
                >
                  <Text style={styles.buttonText}>Income</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterButton,
                    filterType === 'Outcomes' && styles.activeButton
                  ]}
                  onPress={() => toggleFilter('Outcomes')}
                >
                  <Text style={styles.buttonText}>Outcome</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
        ListFooterComponent={
          transactions.length === 0 ? (
            <Text style={styles.noTransactionsText}>No transactions available</Text>
          ) : null
        }
      />

      <AddButton id_usuario={id_user} nombre={name}  correo={email} patrimonio={budget}/>
      <Footer navigation={navigation} id_usuario={id_user} nombre={name} correo={email} patrimonio={budget} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  cardContent: {
    justifyContent: 'space-between',
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginBottom: 20
  },
  greeting: {
    marginTop:40,
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
  detailsButton: {
    padding: 4,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 15,
    marginTop: 10,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  detailsButtonText: {
    color: 'gray',
    textAlign: 'center',
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
  noTransactionsText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
});

export default Transaction;
