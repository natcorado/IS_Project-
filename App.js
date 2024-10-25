import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FirstPage from './screens/FirstPage';
import Login from  './screens/Login';
import Signup from  './screens/Signup';
import Home from  './screens/Home';
import Home_budget from  './screens/Home_budget';
import Transaction from './screens/Transaction';
import Budget from './screens/Budget';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FirstPage">
        <Stack.Screen name="FirstPage" component={FirstPage} />
        <Stack.Screen name="Home_budget" component={Home_budget} />
        <Stack.Screen name="SignUp" component={Signup} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Transaction" component={Transaction} />
        <Stack.Screen name="Budget" component={Budget} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}