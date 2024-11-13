import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image, TextInput} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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
    const [categoriesText1, setCategoriesText1] = useState('');

    const [showAI, setShowAI] = useState(false);
    const [welcomeVisible, setWelcomeVisible] = useState(true);

    const [incomes, setIncomes] = useState(null); 
    const [outcomes, setOutcomes] = useState(null);
    const [lastIncomes, setlastIncomes] = useState(0); 
    const [lastoutcomes, setlastOutcomes] = useState(0); 

    const [inputValue, setInputValue] = useState(''); 
    const [salary, setSalary] = useState('');
    const [aiResponse, setAiResponse] = useState('If we are taking too long, maybe we are busy');

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

    useEffect(() => {
        handleCategories();
    }, []);
    
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
    
    /*************************** HUGGING FACE ********************************/

    const handleSubmit = async () => {
        if (inputValue.trim() === '' || salary.trim() === '') {
            Alert.alert('Error', 'Por favor llena ambos campos antes de enviar.');
            return;
        }
    
        const aiContext = `
            I have the following financial information:
            - Total Income: ${incomes}
            - Total Expenses: ${outcomes}
            - Last Income: ${lastIncomes ?? 0}
            - Last Expense: ${lastoutcomes ?? 0}
            - Budget: ${budget}
            - Context: ${inputValue}
            - Salary: ${salary}
            - Expense Categories: ${categoriesText1}

            I need you to provide 3 specific recommendations to help optimize my financial management. These recommendations should focus on how to reduce costs or better manage spending based on the provided financial data.
            - Start your response with the word "Answers:" followed by a colon.

        `;
    
        try {
            const response = await query({
                "inputs": aiContext
            });
    
            if (response && response.length > 0) {
                const aiGeneratedText = response[0].generated_text || "No recommendations found.";
                
                
                setAiResponse(aiGeneratedText); 
                console.log("AI Response:", aiGeneratedText); 
            } else {
                setAiResponse("No response from the AI model. We are busy, try again later");
                console.log("AI Response:sss"); 
            }
        } catch (error) {
            console.error("Error querying AI:", error);
            setAiResponse("Error querying AI model.");
        }
    };
    
    async function query(data) {
        try {
            const response = await fetch("https://api-inference.huggingface.co/models/google/gemma-2-2b-it", {
                headers: {
                    Authorization: "Bearer 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",
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(data),
            });
    
            const result = await response.json();
            console.log("AI Model Response:", result); 
            
            return result; 
        } catch (error) {
            console.error("Error querying AI:", error);
            return null; 
        }
    }
    
    
    
    
  
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

            //for ai usage
            const categoriesText = formattedCategories.map(item => {
                return `${item.title}: ${item.totalAmount} (${item.isPositive ? "Ingreso" : "Egreso"})`;
            }).join("\n");


            setTransactions(formattedCategories);
            setCategoriesText1(categoriesText);
        } else {
            Alert.alert("Error", jsonResponse.error || "Failed to retrieve data");
        }
        } catch (error) {
        Alert.alert("Error", "An error occurred. Please try again.");
        }
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
                    <Text style={styles.greeting}>Welcome to,</Text>
                    <Text style={styles.userName}>Overall Transaction Analysis</Text>
                    {welcomeVisible && (
                        <View style={styles.welcomeMessage}>
                            <TouchableOpacity 
                                style={styles.closeButton} 
                                onPress={() => setWelcomeVisible(false)} 
                            >
                                <Text style={styles.closeButtonText}>X</Text>
                            </TouchableOpacity>
                            <Image source={userImage} style={styles.welcomeImage} />
                            <Text style={styles.welcomeText}>
                                It seems like you haven't started tracking your finances yet. Try using the AI assistant!
                            </Text>
                        </View>
                    )}



                    <View style={styles.settingsContainer}>
                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={() => setShowAI(!showAI)}
                        >
                            <Text style={styles.settingText}>AI Assistant</Text>
                            <Icon name={showAI ? 'angle-up' : 'angle-down'} size={20} />
                        </TouchableOpacity>

                        {showAI && (
                            <View style={styles.settingDetails}>
                                <Text style={styles.noteText}>
                                    Please enter your AI Assistant context here:
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    value={inputValue}
                                    onChangeText={setInputValue}
                                    placeholder="Enter context"
                                />

                                <Text style={styles.noteText}>
                                    Please enter your salary:
                                </Text>

                                <TextInput
                                    style={styles.input}
                                    value={salary}
                                    onChangeText={setSalary}
                                    placeholder="Enter salary"
                                    keyboardType = "numeric"
                                />

                                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                    <Text style={styles.submitButtonText}>Submit</Text>
                                </TouchableOpacity>

                            </View>
                        )}

                        {showAI && aiResponse && (
                            <View style={styles.aiResponseContainer}>
                                <Text style={styles.aiResponseText}>{aiResponse}</Text>
                            </View>
                        )}

                    </View>
                    <Text style={[
                            styles.subtitle,
                        ]}
                    >
                        Total income by category
                    </Text>
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
        marginBottom: 15,
    },
    greeting: {
        marginTop:40,
        fontSize: 16,
        color: '#333',
    },
    subtitle: {
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
    welcomeMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0', 
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ccc', 
    },
    welcomeImage: {
        width: 40,  
        height: 40,
        borderRadius: 20,
        marginRight: 15, 
    },
    welcomeText: {
        fontSize: 14,
        color: '#666', 
        fontWeight: '500', 
        textAlign: 'left',
        flex: 1, 
    },
    settingsContainer: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        marginBottom: 15,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    settingText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    settingDetails: {
        marginTop: 10,
        paddingLeft: 20,
    },
    noteText: {
        fontSize: 14,
        color: '#888',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        fontSize: 16,
        marginBottom: 15,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        borderRadius: 15,
        width: 25, 
        height: 25, 
        borderColor: 'black', 
        borderWidth: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#fff', 
    },
    closeButtonText: {
        fontSize: 16,
        color: '#000', 
        fontWeight: 'bold', 
    },
    submitButton: {
        marginTop: 5, 
        backgroundColor: 'black', 
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff', 
        fontSize: 16,
        fontWeight: 'bold',
    },
    aiResponseContainer: {
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    aiResponseText: {
        fontSize: 16,
        color: '#333',
    },
    
    
});

export default Transaction;
