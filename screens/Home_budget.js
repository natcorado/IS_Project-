import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Footer from './../components/Footer';
import AddButton from './../components/AddButton';


const Home_budget = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('Narendra Modi');
  const [budget, setBudget] = useState(25890);
  const [incomes, setIncomes] = useState(500);
  const [outcomes, setOutcomes] = useState(500);
  const [progress, setProgress] = useState(0.7);

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
            <TouchableOpacity style={styles.budgetButton}>
              <FontAwesome name="arrow-down" size={16} color="#fff" style={styles.icon} />
              <Text style={styles.budgetButtonText}>Add income</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.budgetButton}>
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
                <Text style={styles.cardAmount}>${incomes.toLocaleString()}</Text>
              </View>
              <View style={styles.cardTextContainer2}>
                <Text style={styles.cardPercentage}>+12.503%</Text>
                <TouchableOpacity style={styles.detailsButton}>
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
                <Text style={styles.cardAmount}>${outcomes.toLocaleString()}</Text>
              </View>
              <View style={styles.cardTextContainer3}>
                <Text style={styles.cardPercentage}>+12.503%</Text>
                <TouchableOpacity style={styles.detailsButton}>
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
            <Text style={styles.budgetProgressAmount}>$738</Text>
          </View>
          <View style={styles.budgetProgressInfo}>
            <Text style={styles.budgetProgressLabel}>Monthly budget</Text>
            <Text style={styles.budgetProgressAmount}>$2,550</Text>
          </View>
          <ProgressBar progress={progress} color={'#000'} style={styles.progressBar} /> 
        </View>
      </ScrollView>

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
    marginVertical: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
});

export default Home_budget;
