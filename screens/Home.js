import React, {useState, useEffect} from "react";
import { VictoryPie } from "victory-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import{
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
  
} from 'react-native';


import {COLORS, FONTS, SIZES, icons} from "../constants"


const Home = () => {    
    const styles = StyleSheet.create({
      box: {
        borderWidth: 1,        
        borderColor: '#BEC1D2', 
        padding: 20,          
        backgroundColor: 'white', 
        borderRadius: 10,     
        margin:15,
        height:550
      },
    });
    


    const [currentDate, setCurrentDate] = useState(new Date()); // Inicializar correctamente como Date
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('1D');

    const openDatePicker = () => {
      setShowDatePicker(true);
  };  
    const onDateChange = (event, selectedDate) => {
      const newDate = selectedDate || currentDate; // Cambiar nombre de la variable para evitar sobrescribir
      setShowDatePicker(false); // Cerrar el selector de fecha
      setCurrentDate(newDate); // Actualizar la fecha seleccionada con el valor Date
    };
  

     // Mantener currentDate como un objeto Date
     useEffect(() => {
      setCurrentDate(new Date());
    }, []);


    {/*Consts */}

    function renderNavBar(){
        return(
            <View
             style= {{
                flexDirection: 'row',
                height: 80,
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                paddingHorizontal: SIZES.padding,
                backgroundColor: COLORS.white,

             }}
            >
                <TouchableOpacity
                    style={{ justifyContent: 'center', width: 50 }}
                    onPress={() => console.log('Go Back')}
                >
                    <Image 
                     source={icons.back_arrow}
                     style={{
                         width: 30,
                         height: 30,
                         tintColor: COLORS.primary
                    }}
                    />

                </TouchableOpacity>

                
                <TouchableOpacity
                    style={{ justifyContent: 'center', width: 50 }}
                    onPress={() => console.log('Go Back')}
                >
                    <Image 
                     source={icons.more}
                     style={{
                         width: 30,
                         height: 30,
                         tintColor: COLORS.primary
                    }}
                    />

                </TouchableOpacity>


                
            </View>
        )
    }


    function renderHeader() {

      const styles = StyleSheet.create({
        box: {
            // Color del borde
          padding: 20,           // Espacio interior (dentro del cuadro)
          marginTop:10 ,            // Espacio exterior (fuera del cuadro)
          backgroundColor: 'black', // Color de fondo
          borderRadius: 10,      // Bordes redondeados
        },
        text: {
          fontSize: 16,
        },
      });

        return(

            <View style = {{paddingHorizontal: SIZES.padding2, paddingVertical:SIZES.padding, backgroundColor: COLORS.white, paddingTop: 50}}>
                <View >     
                <Text style={{ color: COLORS.darkgray, ...FONTS.h5}}>Good Evening,</Text>
                <Text style={{ color:COLORS.black, ...FONTS.h1, fontSize: 30, fontWeight: 'bold'}}>User</Text>
                  <View style={styles.box}>
                <Text style={{ color: COLORS.white, ...FONTS.h4,  }}>My budget:</Text>
                <Text style={{ color: COLORS.white, ...FONTS.largeTitle, fontWeight: 'bold', marginTop: 10 }}>$25,890.00</Text>
                  </View>
                </View>
            </View>
        )
    }


    function boxesCalendar() {
      const styles = StyleSheet.create({
        row: {
          flexDirection: 'row',
          marginTop: 10,
          margin: 'auto',
        },
        button: {
          padding: 20,
          paddingVertical: 9,
          borderRadius: 7,
          backgroundColor: 'white',
          alignSelf: 'flex-center',
          marginHorizontal: '4%',
          marginBottom: 6,
          minWidth: '10%',
          textAlign: 'center',
          borderColor: 'black',
          borderWidth: 1,
        },
        selected: {
          backgroundColor: 'black',
          borderWidth: 0,
        },
        buttonLabel: {
          fontSize: 12,
        },
        selectedLabel: {
          color: 'white',
        },
      });
    
      const [StateDay, setStateDay] = useState('1D');
    
      return (
        <View>
          {/* Botones de Período */}
          <Text style={{ color: COLORS.black, ...FONTS.h2, fontWeight: 'bold' }}>
            Expenses by category
          </Text>
          <View style={styles.row}>
            {['1D', '1W', '1M', '1Y'].map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => setStateDay(value)}
                style={[
                  styles.button,
                  StateDay === value && styles.selected,
                ]}
              >
                <Text
                  style={[
                    styles.buttonLabel,
                    StateDay === value && styles.selectedLabel,
                  ]}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
    
          {/* Calendario */}
          <View style={{ marginTop: 10, alignItems: 'center'}}>
          <TouchableOpacity onPress={openDatePicker} style={{ flexDirection: 'row' }}>
            <Image source={icons.calendar} style={{ width: 20, height: 20, tintColor: COLORS.lightBlue }} />
            <Text style={{ marginLeft: 10 }}>{currentDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        <View>
            <Text></Text>
          </View>
          
          
          {/* Mostrar el selector de fecha cuando showDatePicker sea true */}
          {showDatePicker && (
            <DateTimePicker
              value={currentDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>
      );
    }
    
    
    // Datos del gráfico (y la lista)
  const pieData = [
    { key: '1', name: "House", y: 41.35 },
    { key: '2', name: "Credit card", y: 21.00 },
    { key: '3', name: "Food", y: 17.00 },
    { key: '4', name: "Transport", y: 10.00 },
    { key: '5', name: "Shopping", y: 10.65 }
  ];

  // Estilos
  const styles2 = StyleSheet.create({
    box: {
      borderWidth: 1,
      borderColor: '#BEC1D2',
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
      margin: 15,
    },
    listContainer: {
      height: 100,  // Altura fija para que la lista tenga scroll si es necesario
    },
    listItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#E0E0E0',
    },
    listText: {
      fontSize: 16,
      color: COLORS.black,
    },
    listAmount: {
      fontSize: 16,
      color: COLORS.primary,
    }
  });

   // Función para renderizar el gráfico
   function renderPieChart() {
    return (
      <View style={{ alignItems: 'center', marginTop: -40 }}>
        <VictoryPie
          data={pieData}
          colorScale={["#FF5F5F", "#50E3C2", "#4A90E2", "#F8E71C", "#BD10E0"]}
          innerRadius={70}
          labelRadius={80}
          labelComponent={<></>}
          width={SIZES.width}
          height={300}
        />
      </View>
    );
  }
  
 // Función para renderizar la lista de datos debajo del gráfico
 function renderList() {
  return (
    <View style={styles2.listContainer}>
      <FlatList
        data={pieData} // Usar los mismos datos del gráfico
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <View style={styles2.listItem}>
            <Text style={styles2.listText}>{item.name}</Text>
            <Text style={styles2.listAmount}>{item.y.toFixed(2)}%</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false} // Opcional: Oculta el indicador de desplazamiento vertical
      />
    
    
    </View>
    
  );
}

  function InsertarReporte(){

      return(
      <TouchableOpacity
          style={{margin: 'auto'}}
          onPress={() => console.log('Go Back')}
      >
          <Image 
            source={icons.plus}
            style={{
                width: 50,
                height: 50,
          }}
          />
            </TouchableOpacity>
      );
  }
     
  return (
    <View style = {{flex:1,backgroundColor: COLORS.lightGray2}}>
        {/* Nav var section */}
        {/* renderNavBar() */}

        {/* Header section */}
        {renderHeader()}

      <View style={styles.box}>
        <View style={{marginBottom:1}}>
           {boxesCalendar()}
        </View>
          {/* Pie chart section */}
        {renderPieChart()}


        {/* Lista de datos debajo del gráfico */}
        {renderList()}

        {/* Insertar reporte  PLUS */}
        {InsertarReporte()}
        </View> 
    </View>
  );
};

export default Home;