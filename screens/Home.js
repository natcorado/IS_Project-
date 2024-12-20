import React, { useState, useEffect , useCallback} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Footer from './../components/Footer';
import AddButton from './../components/AddButton';

const Home_budget = ({ route , navigation}) => {
  const { id_usuario, nombre, correo, patrimonio} = route.params;

  const [id_user, setId_user] = useState(id_usuario);
  const [name, setName] = useState(nombre);
  const [email, setEmail] = useState(correo); 
  const [budget, setBudget] = useState(patrimonio); 
  const [incomes, setIncomes] = useState(null); 
  const [outcomes, setOutcomes] = useState(null);
  const [progress, setProgress] = useState(0);
  const [lastIncomes, setlastIncomes] = useState(0); 
  const [lastoutcomes, setlastOutcomes] = useState(0); 

  const handleOverBudgetAlert = () => {
    console.log("User Data:", { budget, incomes});
    
    Alert.alert(
      "¡Atención!",
      "Sobrepasaste tus ingresos, no es posible que tu presupuesto sea mayor que tus ingresos. ¡Ten cuidado!"
    );
  };

  const calculateMarginLeft = (incomes) => {

    if (incomes >= 10000) {
      return '26%'; 
    } else if (incomes >= 1000) {
      return '29%'; 
    } else if (incomes >= 100) {
      return '32%';
    }
    return '33%'; 
  };

  const calculateMarginLeft1 = (incomes) => {

    if (incomes >= 10000) {
      return '25%'; 
    } else if (incomes >= 1000) {
      return '28%'; 
    } else if (incomes >= 100) {
      return '28%';
    } else if (incomes > 10) {
      return '35%';
    } 
    return '29%'; 
  };

  const images = [
    require('./../assets/avatars/Cat.png'),
    require('./../assets/avatars/Cow.png'),
    require('./../assets/avatars/Frog.png'),
    require('./../assets/avatars/Hamster.png'),
    require('./../assets/avatars/Hedgehog.png'),
    require('./../assets/avatars/Koala.png'),
    require('./../assets/avatars/Panda.png'), 
    require('./../assets/avatars/Pig.png'),
  ];

  const userImage = images[id_user % 8];
  const hasChanges = () => {
      const currentBudget = parseFloat(budgetTemporal);
      const initialBudgetValue = parseFloat(initialBudget);
      return name.trim() !== initialName.trim() || email.trim() !== initialEmail.trim() || currentBudget !== initialBudgetValue;
  };


  const handleGetTotalIncome = async () => {
    try {
        console.log("Fetching total income...");
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
        console.log("Raw Response Text (Income):", rawText);

        const jsonResponse = JSON.parse(rawText);
        console.log("Parsed JSON Response (Income):", jsonResponse);

        if (jsonResponse.status === "success" && jsonResponse.data.length > 0) {
            console.log("Income Total:", jsonResponse.data[0].total);
            setIncomes(jsonResponse.data[0].total);
        } else {
            console.error("Income fetch failed:", jsonResponse.error || "Unknown error");
            Alert.alert("Error", jsonResponse.error || "Failed to retrieve data");
        }
    } catch (error) {
        console.error("Error fetching total income:", error);
        Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  const handleGetTotalOutcome = async () => {
    try {
        console.log("Fetching total income...");
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
        console.log("Raw Response Text (Outcome):", rawText);

        const jsonResponse = JSON.parse(rawText);
        console.log("Parsed JSON Response (Outcome):", jsonResponse);

        if (jsonResponse.status === "success" && jsonResponse.data.length > 0) {
            console.log("Income Total:", jsonResponse.data[0].total);
            setOutcomes(jsonResponse.data[0].total);
        } else {
            console.error("Income fetch failed:", jsonResponse.error || "Unknown error");
            Alert.alert("Error", jsonResponse.error || "Failed to retrieve data");
        }
    } catch (error) {
        console.error("Error fetching total income:", error);
        Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  const handleGetTotaLastlIncome = async () => {
    try {
        console.log("Fetching total income...");
        const response = await fetch('http://10.10.10.74/API/getIncomesAndOutcomes.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id_usuario: id_user,
                Income_Outcome: 6,
            }),
        });

        const rawText = await response.text();
        console.log("Raw Response Text (Last Income):", rawText);

        const jsonResponse = JSON.parse(rawText);
        console.log("Parsed JSON Response (Last Income):", jsonResponse);

        if (jsonResponse.status === "success" && jsonResponse.data.length > 0) {
            console.log("Income Total:", jsonResponse.data[0].total);
            setlastIncomes(jsonResponse.data[0].total);
        } else {
            console.error("Income fetch failed:", jsonResponse.error || "Unknown error");
            Alert.alert("Error", jsonResponse.error || "Failed to retrieve data");
        }
    } catch (error) {
        console.error("Error fetching total income:", error);
        Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  const handleGetTotaLastlOutcome = async () => {
    try {
        console.log("Fetching total income...");
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
        console.log("Raw Response Text (Last Outcome):", rawText);

        const jsonResponse = JSON.parse(rawText);
        console.log("Parsed JSON Response (Last Outcome):", jsonResponse);

        if (jsonResponse.status === "success" && jsonResponse.data.length > 0) {
            console.log("Income Total:", jsonResponse.data[0].total);
            setlastOutcomes(jsonResponse.data[0].total);
        } else {
            console.error("Income fetch failed:", jsonResponse.error || "Unknown error");
            Alert.alert("Error", jsonResponse.error || "Failed to retrieve data");
        }
    } catch (error) {
        console.error("Error fetching total income:", error);
        Alert.alert("Error", "An error occurred. Please try again.");
    }
  };


  const calculatePercentageChange = (current, previous) => {
    if (previous === 0 || previous === null) {
      return 0; 
    }
    return ((current - previous) / previous) * 100;
  };
  
  
  useEffect(() => {
    console.log('Route Params:', route.params);
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

  
  useFocusEffect(
    useCallback(() => {
        console.log("useFocusEffect triggered");
        console.log("User Data:", { id_user, name, email, budget });

        handleGetTotalIncome();
        handleGetTotalOutcome();
        handleGetTotaLastlIncome();
        handleGetTotaLastlOutcome();


        return () => {
            console.log("Cleanup on useFocusEffect unmount");
        };
    }, [id_user])
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good Evening,</Text>
          <Text style={styles.userName}>{name}</Text>
        </View>

        <View style={styles.balanceCard}>
          <View style={styles.budgetCard}>
            <Text style={styles.balanceText}>My Budget:</Text>
            {budget > parseFloat(incomes) && (
              <TouchableOpacity style={styles.alertButton} onPress={handleOverBudgetAlert}>
                <View style={styles.redDot} />
              </TouchableOpacity>
            )}
          </View>
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

        { (parseFloat(outcomes) > parseFloat(budget)) && (
          <View style={styles.welcomeMessage}>
            <Image source={userImage}style={styles.welcomeImage} />
              <Text style={styles.welcomeText}>
                You've exceeded your budget. Be careful with your spending!
              </Text>        
          </View>
        )}

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

              <View style={[
                      styles.cardTextContainer2,
                      { marginLeft: calculateMarginLeft(incomes) }, 
                ]}
              >
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
                  onPress={() => {
                    handleEmail();
                    navigation.navigate('DetailIncome', {
                      type: 'Income',
                      id_usuario: id_user,
                      nombre: name,
                      correo: email,
                      patrimonio: budget,
                    });
                  }} 
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
              <View style={[
                      styles.cardTextContainer2,
                      { marginLeft: calculateMarginLeft1(outcomes) }, 
                ]}
              >
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
                  onPress={() => {
                    handleEmail();
                    navigation.navigate('DetailIncome', {
                      type: 'Outcome',
                      id_usuario: id_user,
                      nombre: name,
                      correo: email,
                      patrimonio: budget,
                    });
                  }} 
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
          
          <ProgressBar
            progress={progress}
            color={parseFloat(outcomes) > parseFloat(budget) ? '#b30000' : '#000'}
            style={[
              styles.progressBar,
              backgroundColor ='#eae9ef'
            ]}
          />

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
  budgetCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }, 
  redDot: {
    width: 20,
    height: 20,
    backgroundColor: '#ff0000',
    borderRadius: 20,
  },
  welcomeMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8d7da',  
    padding: 15,
    borderRadius: 5,  
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f5c6cb', 
},
welcomeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
},
welcomeText: {
    fontSize: 15,
    color: '#721c24',  
    fontWeight: '500',
    textAlign: 'left',
    flex: 1,
},

});

export default Home_budget;