import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Footer from './../components/Footer';
import AddButton from './../components/AddButton';
import Icon from 'react-native-vector-icons/FontAwesome';

const Incomes = ({ route }) => {
  const { id_usuario, nombre, correo, patrimonio } = route.params;
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [id_user, setId_user] = useState(id_usuario);
  const [name, setName] = useState(nombre);
  const [email, setEmail] = useState(correo);
  const [budget, setBudget] = useState(patrimonio);
  const [filterType, setFilterType] = useState('All');
  const [Outcome_Income, setOutcomes_Incomes] = useState(2);

  const Maincategories = [
    { name: 'Categoría de la transacción' },
    { name: 'Rango de fecha' },
    { name: 'Monto' },
    { name: 'Descripción o palabra clave' },
  ];

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

  const handleListCategories = async () => {
    try {
      const response = await fetch('http://10.10.10.74/API/getCategories.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_usuario: id_user,
          Outcome_Income: Outcome_Income,
          Read_Write: 0,
          Category: selectedCategory
        }),
      });

      const rawText = await response.text();
      console.log("Raw Response Text:", rawText);

      const jsonResponse = JSON.parse(rawText);
      console.log("Parsed JSON Response:", jsonResponse);

      if (jsonResponse.status === "success") {
        const fetchedCategories = jsonResponse.data.map(item => ({
          name: item.categoria.trim(),
          id_tipo: item.id_tipo
        }));
        setCategories(fetchedCategories);
      } else {
        Alert.alert("Error", "No se pudieron cargar las categorías.");
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al cargar las categorías.");
      console.error("Error loading categories:", error);
    }
  };

  useEffect(() => {
    handleListCategories();
  }, [selectedCategory, Outcome_Income]);

  const FilterCategories = [
    { name: 'Categoría de la transacción' },
    { name: 'Rango de fecha' },
    { name: 'Monto' },
    { name: 'Descripción o palabra clave' },
  ];

  const handleCategoryChange = (itemValue) => {
    setSelectedCategory(itemValue);
  };

  const handleMainCategoryChange = (itemValue) => {
    setSelectedMainCategory(itemValue);
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
      case 'Salario':
        iconName = 'money-bill-alt';
        break;
      case 'Gimnasio':
        iconName = 'dumbbell';
        break;
      case 'Intereses':
        iconName = 'percentage';
        break;
      case 'Internet':
        iconName = 'wifi';
        break;
      case 'Salud':
        iconName = 'heartbeat';
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
    // Verificar el tipo de transacción
    const typeMatches = filterType === 'All' || 
                        (filterType === 'Incomes' && transaction.isPositive) || 
                        (filterType === 'Outcomes' && !transaction.isPositive);
  
    // Mostrar en consola el resultado de la condición de tipo
    console.log(`Transaction type: ${transaction.isPositive ? 'Income' : 'Outcome'}, Filter type: ${filterType}, Type matches: ${typeMatches}`);
  
    // Verificar la categoría
    const categoryMatches = !selectedCategory || transaction.title.trim() === selectedCategory;
  
    // Mostrar en consola el resultado de la condición de categoría
    console.log(`Transaction category: ${transaction.title}, Selected category: ${selectedCategory}, Category matches: ${categoryMatches}`);
  
    // Retornar el filtro combinado
    const result = typeMatches && categoryMatches;
    console.log(`Transaction passes filter: ${result}`);
  
    return result;
  });
  
  

  const toggleFilter = (filter) => {
    if (filter === 'Incomes') {
      setOutcomes_Incomes(1);
    } else if (filter === 'Outcomes') {
      setOutcomes_Incomes(0);
    } else {
      setOutcomes_Incomes(-1);
    }

    setFilterType(filter === filterType ? 'All' : filter);
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
              <Text style={styles.greeting}>Welcome to,</Text>
              <Text style={styles.userName}>Detail Transaction</Text>
            </View>

            <Text style={styles.category}>Filter</Text>
            <Picker
              selectedValue={selectedMainCategory}
              style={styles.picker}
              onValueChange={handleMainCategoryChange}
            >
              {Maincategories.map((category, index) => (
                <Picker.Item key={index} label={category.name} value={category.name} />
              ))}
            </Picker>

            {selectedMainCategory === 'Categoría de la transacción' && (
              <Text style={styles.category}>Category:</Text>
            )}
            
            {selectedMainCategory === 'Categoría de la transacción' && (
              <Picker
                selectedValue={selectedCategory}
                style={styles.picker}
                onValueChange={handleCategoryChange}
              >
                {categories.map((category, index) => (
                  <Picker.Item key={index} label={category.name} value={category.name} />
                ))}
              </Picker>
            )}



            <View style={styles.filterSection}>
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

      <AddButton id_usuario={id_user} nombre={name} correo={email} patrimonio={budget} />
      <Footer  navigation={navigation} id_usuario={id_user} nombre={name} correo={email} patrimonio={budget}/>
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
    paddingBottom: 20,
  },
  greeting: {
    marginTop: 40,
    fontSize: 18,
    color: '#666',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    marginBottom: 20,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#ddd',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: '#005AFF',
  },
  buttonText: {
    color: '#fff',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  transactionDetails: {
    flex: 1,
    paddingLeft: 10,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noTransactionsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#ddd',
  },
  toggleText: {
    color: '#fff',
    fontSize: 16,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
  },
  picker: {
    height: 50,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginBottom:20
  },
  
});

export default Incomes;
