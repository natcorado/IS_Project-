import React, {useState, length} from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import{View,Text,Image,TouchableOpacity,FlatList,} from 'react-native';
import { VictoryPie } from 'victory-native'; 

import {COLORS, FONTS, SIZES, icons} from "../constants";
import BC_styles from './HomeStyles/boxesCalendar.js';
import RH_styles from "./HomeStyles/renderHeader_Styles.js";
import RL_styles from "./HomeStyles/renderList_Styles.js";
import box_styles from "./HomeStyles/box_Styles.js";


const Home = () => {

// Fecha por defecto y establecimiento de la misma por setShowDatePicker
const [currentDate, setCurrentDate] = useState(new Date()); 
//Fecha seleccionada por el usuario
const [showDatePicker, setShowDatePicker] = useState(false);
//Definir el dia del boton por defectos
const [StateDay, setStateDay] = useState('1D');

const getDateRange = (selectedDate, period) => {
  const start = new Date(selectedDate); 
  const end = new Date(selectedDate);

  switch (period) {
    case '1D':
      console.log(start , "  ----  ", end);
     
      return [start, end];  // Para 1D, solo usamos la fecha seleccionada
    case '1W':
      start.setDate(start.getDate() - start.getDay()); // Inicio de la semana (domingo)
      end.setDate(start.getDate() + 6);  // Fin de la semana (sábado)
      console.log(start , "  ----  ", end);
      return [start, end];
    case '1M':
      start.setDate(1);  // Primer día del mes
      end.setMonth(end.getMonth() + 1);
      end.setDate(0); // Último día del mes
      console.log(start , "  ----  ", end);
      return [start, end];
    case '1Y':
      start.setMonth(0, 1); // Primer día del año
      end.setMonth(11, 31); // Último día del año
      console.log(start , "  ----  ", end);
      return [start, end];
    default:
      return [start, end];
  }
};

//Filtrar los datos con base en el rango de fechas(D,W,M,Y)
const filterDataByDate = (pieData, startDate, endDate) => {
  return pieData.filter(item => item.date >= startDate && item.date <= endDate);
};

// Seteo de los datos del pieChart
const [filteredData, setFilteredData] = useState(pieData || []);  

 // Actualizar el botón seleccionado(D,W,M,Y)
const handlePeriodChange = (newPeriod) => {
  setStateDay(newPeriod); 
  
  // Obtener el rango de fechas para el nuevo período (Definir startDate y endDate en base al boton clickeado) 
  const [startDate, endDate] = getDateRange(currentDate, newPeriod);
  
  // Filtrar los datos por el nuevo rango de fechas
  const newFilteredData =  filterDataByDate(pieData, startDate, endDate);

    // Actualizar los datos filtrados
  newFilteredData.length >0 ?  setFilteredData(newFilteredData) : setFilteredData([{ key: '1', name: "Nothing ", color: "gray", y: 1}]);

  console.log(filteredData);

};

// Funcion Habilitar el calendario al darle click
const openDatePicker = () => {
  setShowDatePicker(true);
};  

//Funcion para setear la nueva fecha en el calendario al darle ACEPTAR
const onDateChange = (event, selectedDate) => {
  const newDate = selectedDate || currentDate; // Cambiar nombre de la variable para evitar sobrescribir
  setShowDatePicker(false); 
  setCurrentDate(newDate);
 
};

// Datos del gráfico (y la lista)
const pieData = [
  { key: '1', name: "House", color: "#FF5F5F", y: 41.35, date: new Date('2024-02-19') },
  { key: '2', name: "Credit card", color: "#50E3C2", y: 21.00, date: new Date('2024-02-20') },
  { key: '3', name: "Food", color: "#4A90E2", y: 17.00, date: new Date('2024-02-22') },
  { key: '4', name: "Transport", color: "#F8E71C", y: 10.00, date: new Date('2024-02-23') },
  { key: '5', name: "Shopping", color: "#BD10E0", y: 10.65, date: new Date('2024-02-24') },
  { key: '6', name: "Papa", color: "#AB10E0", y: 10.65, date: new Date('2024-10-25') }
];


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
    return(
        <View style = {{paddingHorizontal: SIZES.padding2, backgroundColor: COLORS.white, paddingTop: 35}}>
            <View >     
            <Text style={{ color: COLORS.darkgray, ...FONTS.h5}}>Good Evening,</Text>
            <Text style={{ color:COLORS.black, ...FONTS.h1, fontSize: 30, fontWeight: 'bold'}}>User</Text>
              <View style={RH_styles.box}>
            <Text style={{ color: COLORS.white, ...FONTS.h4,  }}>My budget:</Text>
            <Text style={{ color: COLORS.white, ...FONTS.largeTitle, fontWeight: 'bold'}}>$25,890.00</Text>
              </View>
            </View>
        </View>
    )
}


function boxesCalendar() {
  return ( 
    <View>
      {/* Titulo */}
      <Text style={{ color: COLORS.black, ...FONTS.h2, fontWeight: 'bold' }}>
        Expenses by category
      </Text>

      {/* Calendario */}
      <View style={{ marginTop: 12, alignItems: 'center'}}>
        <TouchableOpacity onPress={openDatePicker} style={{ flexDirection: 'row' }}>
          <Image source={icons.calendar} style={{ width: 20, height: 20, tintColor: COLORS.lightBlue }} />
          <Text style={{ marginLeft: 10 }}>{currentDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
      </View>

      {/* Botones de Período */}
      <View style={BC_styles.row}>
        {['1D', '1W', '1M', '1Y'].map((value) => (
          <TouchableOpacity
            key={value}
            onPress={() => handlePeriodChange(value)}  // Llamar a handlePeriodChange
            style={[
              BC_styles.button,
              StateDay === value && BC_styles.selected,  // Usar StateDay del estado global
            ]}
          >
            <Text
              style={[
                BC_styles.buttonLabel,
                StateDay === value && BC_styles.selectedLabel,  // Usar StateDay del estado global
              ]}
            >
              {value}
            </Text>
          </TouchableOpacity>
        ))}
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


  
  // Función para renderizar el gráfico
function renderPieChart() {
  return (
    <View style={{ alignItems: 'center', marginTop: -10, marginBottom: -30, paddingVertical: 0 }}>
      <VictoryPie
        data={filteredData}
        colorScale={filteredData.map(item => item.color)} 
        innerRadius={70}
        labelRadius={0}  r
        labelComponent={<></>}  // No renderizar etiquetas
        width={300}  // Reducir ancho
        height={300} // Reducir altura
      />
  
    </View>
  );
}
  
 // Función para renderizar la lista de datos debajo del gráfico
 function renderList() {
  return (
    <View style={RL_styles.listContainer}>
      <FlatList
        data={filteredData} // Usar los mismos datos del gráfico
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity>
            
          <View style={RL_styles.listItem}>
            <Text style={[RL_styles.listItem, { backgroundColor: item.color }]}>{item.name}</Text>
            <Text style={RL_styles.listAmount}>{ item.y.toFixed(2)}%</Text>
          </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={true}
      />
    
    
    </View>
    
  );
}

function InsertarReporte() {
  return (
      <TouchableOpacity onPress={() => console.log('Go Back')}>
          <Image
            source={icons.plus}
            style={{width: 50,height: 50,marginLeft: 'auto'}}/>
      </TouchableOpacity>
  );
}
   
  return (
    
    <View style = {{flex:1,backgroundColor: COLORS.lightGray2}}>
      
        {/* Nav var section */}
        {/* renderNavBar() */}

        {/* Header section */}
        {renderHeader()}

      <View style={box_styles.box}>
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