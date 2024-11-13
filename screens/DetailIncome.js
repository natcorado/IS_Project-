import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Footer from './../components/Footer';
import AddButton from './../components/AddButton';
import Icon from 'react-native-vector-icons/FontAwesome';

const Transaction = ({ route }) => {
  const { type, id_usuario, nombre, correo, patrimonio } = route.params;
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [type_in_out, setType_in_out] = useState(type);
  const [id_user, setId_user] = useState(id_usuario);
  const [name, setName] = useState(nombre);
  const [email, setEmail] = useState(correo);
  const [budget, setBudget] = useState(patrimonio);

  useEffect(() => {
    handleCategories();
  }, []);

  const handleCategories = async () => {
    const Income_Outcome = type_in_out === 'Income' ? 8 : 7;
    try {
      const response = await fetch('http://10.10.10.74/API/getIncomesAndOutcomes.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_usuario: id_usuario,
          Income_Outcome: Income_Outcome,
        }),
      });

      const rawText = await response.text();
      console.log("Raw Response Text:", rawText);

      const jsonResponse = JSON.parse(rawText);
      console.log("Parsed JSON Response:", jsonResponse);

      if (jsonResponse.status === "success") {
        const formattedCategories = jsonResponse.data.map(item => ({
          title: item.categoria.trim(), 
          totalAmount: `$${Math.abs(item.total_cantidad)}`,
          isPositive: parseFloat(item.total_cantidad) > 0,
        }));

        setTransactions(formattedCategories);
      } else {
        Alert.alert("Error", jsonResponse.error || "Failed to retrieve data");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  const renderTransactionItem = ({ item }) => {
    let iconName;
    const title = item.title;

    switch (title) {
      case 'Spotify':
        iconName = 'spotify';
        break;
      case 'Netflix':
        iconName = 'film';
        break;
      case 'Upwork':
        iconName = 'file-text-o';
        break;
      case 'Salario':
        iconName = 'credit-card';
        break;
      case 'Gimnasio':
        iconName = 'credit-card';
        break;
      case 'Intereses':
        iconName = 'credit-card';
        break;
      case 'Internet':
        iconName = 'credit-card';
        break;
      case 'Salud':
        iconName = 'credit-card';
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
        </View>
        <Text style={[styles.transactionAmount, { color: type_in_out === 'Income' ? 'green' : 'red' }]}>
          {item.totalAmount}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item, index) => index.toString()} 
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.greeting}>Good Evening,</Text>
            <Text style={styles.userName}>{name}</Text>
          </View>
        }
        ListFooterComponent={
          transactions.length === 0 ? (
            <Text style={styles.noTransactionsText}>No transactions available</Text>
          ) : null
        }
      />

      <AddButton id_usuario={id_user} nombre={name} correo={email} patrimonio={budget} />
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
  header: {
    marginBottom: 20,
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
  transactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, 
    paddingHorizontal: 15, 
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8, 
    marginVertical: 5,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    width: 40, 
    height: 40, 
    backgroundColor: 'white',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14, 
    fontWeight: 'bold',
    color: '#000',
  },
  transactionAmount: {
    fontSize: 14, 
    fontWeight: 'bold',
  },
  noTransactionsText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
});

export default Transaction;
