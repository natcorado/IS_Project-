import React, { useEffect } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import Home from './screens/Home';  // Importas Home directamente
import CRUD from './screens/CRUD';  // Importas CRUD directamente
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

// Evitar que la pantalla de splash se oculte automáticamente
SplashScreen.preventAutoHideAsync();

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        border: "transparent",
    },
};

const Stack = createStackNavigator();

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
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName={'CRUD'}
            >
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="CRUD" component={CRUD} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
