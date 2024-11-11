import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import FirstPage from './screens/FirstPage';
import Login from  './screens/Login';
import Signup from  './screens/Signup';
import Home from  './screens/Home_budget';
import Home_budget from  './screens/Home';
import Transaction from './screens/Transaction';
import Budget from './screens/Budget';
import CRUD from './screens/CRUD'; 
import Incomes from './screens/Incomes'; 
import Account from './screens/Account'; 

import * as SplashScreen from 'expo-splash-screen';

const Stack = createStackNavigator();
// Evitar que la pantalla de splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        border: "transparent",
    },
};

const App = () => {
    // Carga las fuentes usando useFonts
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
    });

    // UseEffect para ocultar la pantalla de splash una vez que las fuentes estén cargadas
    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    // Retorna null mientras las fuentes están siendo cargadas
    if (!fontsLoaded) {
        return null; // No renderiza nada hasta que las fuentes estén cargadas
    }

    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="FirstPage">
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="CRUD" component={CRUD} />
                <Stack.Screen name="Incomes" component={Incomes}/>
                <Stack.Screen name="FirstPage" component={FirstPage} />
                <Stack.Screen name="Home_budget" component={Home_budget} />
                <Stack.Screen name="SignUp" component={Signup} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Transaction" component={Transaction} />
                <Stack.Screen name="Budget" component={Budget} />
                <Stack.Screen name="Account" component={Account} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;