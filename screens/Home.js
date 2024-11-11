import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Footer from './../components/Footer';
import AddButton from './../components/AddButton';

const Home_budget = ({ route , navigation}) => {
  const { id_usuario, nombre, correo, patrimonio} = route.params;

  const [id_user, setId_user] = useState(id_usuario);
  const [name, setName] = useState(nombre);
  const [email, setEmail] = useState(correo); 
  const [budget, setBudget] = useState(patrimonio); 
  const [incomes, setIncomes] = useState(0); 
  const [outcomes, setOutcomes] = useState(0); 
  const [progress, setProgress] = useState(0);
  const [lastIncomes, setlastIncomes] = useState(0); 
  const [lastoutcomes, setlastOutcomes] = useState(0); 


  const handleGetTotalIncome = async () => {
    try {
        const response = await fetch('http://10.10.10.74/API/getIncomesAndOutcomes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_usuario: id_user,
                Income_Outcome: 4,
            }),
        });

        const rawText = await response.text();
        console.log("Raw Response Text:", rawText);

        const jsonResponse = JSON.parse(rawText);
        console.log("Parsed JSON Response:", jsonResponse);

        if (jsonResponse.status === "success" && jsonResponse.data.length > 0) {
          setIncomes(jsonResponse.data[0].total);
        } else {
          Alert.alert("Error", jsonResponse.error || "Failed to retrieve data");
        }
    } catch (error) {
        Alert.alert("Error", "An error occurred. Please try again.");
        console.error("Login error:", error);
    }
  };

  const handleGetTotalOutcome = async () => {
    try {
        const response = await fetch('http://10.10.10.74/API/getIncomesAndOutcomes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_usuario: id_user,
                Income_Outcome: 3,
            }),
        });

        const rawText = await response.text();
        console.log("Raw Response Text:", rawText);

        const jsonResponse = JSON.parse(rawText);
        console.log("Parsed JSON Response:", jsonResponse);

        if (jsonResponse.status === "success" && jsonResponse.data.length > 0) {
          setIncomes(jsonResponse.data[0].total);
        } else {
          Alert.alert("Error", jsonResponse.error || "Failed to retrieve data");
        }
    } catch (error) {
        Alert.alert("Error", "An error occurred. Please try again.");
        console.error("Login error:", error);
    }
  };


  const handleGetTotalIncomeLastMonth = async () => {
    try {
        const response = await fetch('http://10.10.10.74/API/getIncomesAndOutcomes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_usuario: id_user,
                Income_Outcome: 4,
            }),
        });


        const rawText = await response.text();
        console.log("Raw Response Text:", rawText);

        const jsonResponse = JSON.parse(rawText);
        console.log("Parsed JSON Response:", jsonResponse);

        if (jsonResponse.status === "success" && jsonResponse.data.length > 0) {
          setIncomes(jsonResponse.data[0].total);
        } else {
          Alert.alert("Error", jsonResponse.error || "Failed to retrieve data");
        }
    } catch (error) {
        Alert.alert("Error", "An error occurred. Please try again.");
        console.error("Login error:", error);
    }
    };

  const handleGetTotalOutcomeLastMonth = async () => {
    try {
        const response = await fetch('http://10.10.10.74/API/getIncomesAndOutcomes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_usuario: id_user,
                Income_Outcome: 5,
            }),
        });

        

        const rawText = await response.text();
        console.log("Raw Response Text:", rawText);

        const jsonResponse = JSON.parse(rawText);
        console.log("Parsed JSON Response:", jsonResponse);

        if (jsonResponse.status === "success" && jsonResponse.data.length > 0) {
          setOutcomes(jsonResponse.data[0].total);
        } else {
          Alert.alert("Error", jsonResponse.error || "Failed to retrieve data");
        }
    } catch (error) {
        Alert.alert("Error", "An error occurred. Please try again.");
        console.error("Login error:", error);
    }
  }; 

  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? 100 : 0; 
    }
    return ((current - previous) / previous) * 100;
  };
  
  
  useEffect(() => {
    const totalSpent = outcomes; 
    const totalBudget = budget;
    
    const newProgress = totalBudget > 0 ? totalSpent / totalBudget : 0;
    setProgress(newProgress);

    const currentDate = new Date();
    const currentWeek = Math.ceil((currentDate.getDate() + 6) / 7); 

    if (currentWeek === 3 && newProgress >= 0.85) {
      Alert.alert("Atención", "Has alcanzado el 85% de tu presupuesto este mes.");
    }
    

  }, [outcomes, budget]); 

  const handleEmail= () => {
    console.log('Email:', email );  
  };

  useEffect(() => {
    handleEmail();
    handleGetTotalIncome();
    handleGetTotalOutcome();
    handleGetTotalIncomeLastMonth();
    handleGetTotalOutcomeLastMonth();
  }, []); 
  

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Evening,</Text>
          <Text style={styles.userName}>{name}</Text>
        </View>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceText}>My Budget:</Text>
          <Text style={styles.balanceAmount}>${budget.toLocaleString()}</Text>
          <View style={styles.budgetButtonsContainer}>
            <TouchableOpacity
              style={styles.budgetButton}
              onPress={() => {
                navigation.navigate('Budget', {
                  id_usuario: id_user,
                  nombre: name,
                  patrimonio: budget,
                });
              }}
            >
              <FontAwesome name="arrow-down" size={16} color="#fff" style={styles.icon} />
              <Text style={styles.budgetButtonText}>Add income</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.budgetButton}
              onPress={() => {
                navigation.navigate('Budget', {
                  id_usuario: id_user,
                  nombre: name,
                  patrimonio: budget,
                });
              }}
            >
              <FontAwesome name="arrow-up" size={16} color="#fff" style={styles.icon} />
              <Text style={styles.budgetButtonText}>Add outcome</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text marginBottom={-10} style={styles.recentTransactionsText}>Income and Outcomes Overview</Text>

        <View style={styles.overviewContainer}>
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <FontAwesome name="arrow-down" size={24} color="gray" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Incomes</Text>
                <Text style={styles.cardAmount}>${incomes ? incomes.toLocaleString() : "0"}</Text>
              </View>

              <View style={styles.cardTextContainer2}>
                <Text
                  style={[
                    styles.cardPercentage,
                    calculatePercentageChange(incomes, lastIncomes) > 0
                      ? styles.positive
                      : calculatePercentageChange(incomes, lastIncomes) < 0
                      ? styles.negative
                      : styles.neutral,
                  ]}
                >
                  {calculatePercentageChange(incomes, lastIncomes) >= 0 ? '+' : ''}
                  {calculatePercentageChange(incomes, lastIncomes).toFixed(2)}%
                </Text>
                <TouchableOpacity 
                  style={styles.detailsButton}
                  onPress={() => navigation.navigate('Incomes', { type: 'incomes' })} 
                >
                  <Text style={styles.detailsButtonText}>Details</Text>
                </TouchableOpacity>
              </View>  


            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <FontAwesome name="arrow-up" size={24} color="gray" />
              </View>
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Outcomes</Text>
                <Text style={styles.cardAmount}>${outcomes ? outcomes.toLocaleString() : "0"}</Text>
              </View>
              <View style={styles.cardTextContainer3}>
                <Text
                  style={[
                    styles.cardPercentage,
                    calculatePercentageChange(outcomes, lastoutcomes) > 0
                      ? styles.negative
                      : calculatePercentageChange(outcomes, lastoutcomes) < 0
                      ? styles.positive
                      : styles.neutral,
                  ]}
                >
                  {calculatePercentageChange(outcomes, lastoutcomes) >= 0 ? '+' : ''}
                  {calculatePercentageChange(outcomes, lastoutcomes).toFixed(2)}%
                </Text>
                <TouchableOpacity 
                  style={styles.detailsButton}
                  onPress={() => navigation.navigate('Incomes', { type: 'outcomes' })}
                >
                  <Text style={styles.detailsButtonText}>Details</Text>
                </TouchableOpacity>
              </View>   
            </View>
          </View>
        </View>

        <Text marginBottom={-10} style={styles.recentTransactionsText}>Income and Outcomes Overview</Text>

        <View style={styles.budgetProgressContainer}>
          <View style={styles.budgetProgressInfo}>
            <Text style={styles.budgetProgressLabel}>Left to spend</Text>
            <Text style={styles.budgetProgressAmount}>${(budget - outcomes).toLocaleString()}</Text>
          </View>
          <View style={styles.budgetProgressInfo}>
            <Text style={styles.budgetProgressLabel}>Monthly budget</Text>
            <Text style={styles.budgetProgressAmount}>${budget.toLocaleString()}</Text>
          </View>
          <ProgressBar progress={progress} color={'#000'} style={styles.progressBar} /> 
        </View>
      </ScrollView>

      <AddButton id_usuario={id_user} nombre={name} correo={email} patrimonio={budget}/>
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
  scrollViewContent: {
    paddingBottom: 100,
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
  budgetButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    flex: 1,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
  },
  budgetButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  recentTransactionsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  overviewContainer: {
    marginVertical: 20,
  },
  card: {
    backgroundColor: 'transparent',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 15,
  },
  cardContent: {
    flexDirection: 'row', 
    alignItems: 'flex-start', 
  },
  iconContainer: {
    backgroundColor: '#d3d3d3',
    borderRadius: 6, 
    padding: 20, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextContainer: {
    marginLeft: 20, 
    justifyContent: 'flex-end', 
  },
  cardTextContainer2: {
    marginLeft: '35%', 
    justifyContent: 'flex-end', 
  },
  cardTextContainer3: {
    marginLeft: '31%', 
    justifyContent: 'flex-end', 
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  cardPercentage: {
    color: '#888',
  },
  positive: {
    color: 'green',
  },
  negative: {
    color: 'red',
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
  budgetProgressContainer: {
    backgroundColor: 'transparent',
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 15,
    marginVertical: 20,
  },
  budgetProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetProgressLabel: {
    color: '#888',
  },
  budgetProgressAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 10,
    marginTop: 10,
    borderRadius: 5,
  },
});

export default Home_budget;