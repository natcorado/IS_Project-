import React, {useState, length, useEffect} from "react";
import DateTimePicker from '@react-native-community/datetimepicker';
import{View,Text,Image,TouchableOpacity,FlatList,} from 'react-native';
import { VictoryPie } from 'victory-native'; 
import { useNavigation } from '@react-navigation/native';
import Footer from './../components/Footer';
import AddButton from './../components/AddButton';

import {COLORS, FONTS, SIZES, icons} from "../constants/index.js";
import BC_styles from './HomeStyles/boxesCalendar.js';
import RH_styles from "./HomeStyles/renderHeader_Styles.js";
import RL_styles from "./HomeStyles/renderList_Styles.js";
import box_styles from "./HomeStyles/box_Styles.js";
import IncOutStyles from "./HomeStyles/IncOutStyles.js";


const Home_budget = ({ route, navigation }) => {
  const {id_usuario, nombre, correo, patrimonio} = route.params;
  const [pieData, setPieData] = useState([]);

  const [transactions, setTransactions] = useState([]);

  const [id_user, setId_user] = useState(id_usuario);
  const [name, setName] = useState(nombre);
  const [email, setEmail] = useState(correo); 
  const [budget, setBudget] = useState(patrimonio);
  //Lista de reportes
  const [filteredData, setFilteredData] = useState([{ key: '1', name: "Nothing ", color: "gray", y: 1 }]);
  //Tipo de Reporte
  const [filterType, setFilterType] = useState("Incomes"); 
  //Color de boton
  const [IncOutbuttom , setIncOutbuttom] = useState();
  //Color reporte
  const [categoryColors, setCategoryColors] = useState({});


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
      return [start, end];
    case '1W':
      start.setDate(start.getDate() - start.getDay());
      end.setDate(start.getDate() + 6);
      return [start, end];
    case '1M':
      start.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      return [start, end];
    case '1Y':
      start.setMonth(0, 1);
      end.setMonth(11, 31);
      return [start, end];
    default:
      return [start, end];
  }
};


//Filtrar los datos con base en el rango de fechas(D,W,M,Y)
const filterDataByDate = (data, startDate, endDate) => {
  const start = new Date(startDate).setHours(0, 0, 0, 0);
  const end = new Date(endDate).setHours(0, 0, 0, 0);
  return data.filter(item => {
    const itemDate = new Date(item.date).setHours(0, 0, 0, 0);
    return itemDate >= start && itemDate <= end;
  });
};

useEffect(() => {
  const [startDate, endDate] = getDateRange(currentDate, StateDay);
  const newFilteredData = filterDataByDate(pieData, startDate, endDate);
  setFilteredData(newFilteredData.length > 0 ? newFilteredData : [{ key: '1', name: "Nothing", color: "gray", y: 1 }]);
}, [currentDate, pieData, StateDay]);


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


function getColorForCategory(category) {
  // Si ya existe un color para esta categoría, devolverlo
  if (categoryColors[category]) {
    return categoryColors[category];
  } else{
    // Genera un nuevo color y guarda el color en el estado
    const newColor = getRandomColor();

    
    setCategoryColors(prevColors => ({
      ...prevColors,
      [category]: newColor
    }));
    
    return newColor;
  }

}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


 // Obtener datos desde la API según el tipo de filtro
 const getData = async (type) => {
  try {
    const response = await fetch('http://10.10.10.74/API/getIncomesAndOutcomes.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_usuario: id_usuario, Income_Outcome: type === 'Incomes' ? 1 : 0 }),
    });
    const jsonResponse = await response.json();
    if (jsonResponse.status === "success") {
      const formattedData = jsonResponse.data.map((item, index) => ({
        key: index.toString(),
        name: item.categoria,
        date: new Date(item.fecha), 
        color: getRandomColor(),
        y: Math.abs(item.cantidad),
      }));
      setPieData(formattedData);
    } else {
      Alert.alert("Error", jsonResponse.error || "Failed to retrieve data");
    }
  } catch (error) {
    Alert.alert("Error", "An error occurred. Please try again.");
  }
};

// Llamar a getData cada vez que filterType cambia
useEffect(() => {
  getData(filterType);
}, [filterType]);

// Manejar cambio de filtro entre Incomes y Outcomes
const handleIncomeOutcome = (type) => {
  setFilterType(type);
  
  setIncOutbuttom();
};

// Datos del gráfico (y la lista)
/*
const pieData = [
  { key: '1', name: "House", color: "#FF5F5F", y: 41.35, date: new Date('2024-02-19') },
  { key: '2', name: "Credit card", color: "#50E3C2", y: 21.00, date: new Date('2024-02-20') },
  { key: '3', name: "Food", color: "#4A90E2", y: 17.00, date: new Date('2024-02-22') },
  { key: '4', name: "Transport", color: "#F8E71C", y: 10.00, date: new Date('2024-02-23') },
  { key: '5', name: "Shopping", color: "#BD10E0", y: 10.65, date: new Date('2024-02-24') },
  { key: '6', name: "Papa", color: "#AB10E0", y: 10.65, date: new Date('2024-10-25') },
  { key: '7', name: "herson", color: "blue", y: 10.65, date: new Date('2024-10-26') }
];
*/

function renderHeader() {
    return(
        <View style = {{paddingHorizontal: SIZES.padding2, backgroundColor: COLORS.white, paddingTop: 35}}>
            <View >     
            <Text style={{ color: COLORS.darkgray, ...FONTS.h5}}>Good Evening,</Text>
            <Text style={{ color:COLORS.black, ...FONTS.h1, fontSize: 30, fontWeight: 'bold'}}>{nombre}</Text>
              <View style={RH_styles.box}>
            <Text style={{ color: COLORS.white, ...FONTS.h5 }}>My budget:</Text>
            <Text style={{ color: COLORS.white, ...FONTS.h1, fontWeight: 'bold'}}>${patrimonio}</Text>
              </View>
            </View>
        </View>
    )
}

/*@ */
function boxesCalendar() {
  return ( 
    <View>

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
        labelRadius={0} 
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

// Renderizar botones de filtro
function renderFilterButtons() {
  return (
    <View style={IncOutStyles.buttonGroup}>
      <TouchableOpacity   
      style={[
          IncOutStyles.filterButton,
          filterType === 'Incomes' && BC_styles.selected ,
          
        ]}
      onPress={() => handleIncomeOutcome('Incomes')}>
        <Text
          style={[
            filterType === 'Incomes' && BC_styles.selectedLabel,  // Usar StateDay del estado global
          ]}
        >Income</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          IncOutStyles.filterButton,
          filterType === 'Outcomes' && BC_styles.selected
        ]}
       onPress={() => handleIncomeOutcome('Outcomes')}>
        <Text 
      
        style={[
          filterType === 'Outcomes' && BC_styles.selectedLabel,  // Usar StateDay del estado global
        ]}
        >Outcome</Text>
      </TouchableOpacity>
    </View>
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

        {renderFilterButtons()}
          {boxesCalendar()}
        </View>
          {/* Pie chart section */}
          {renderPieChart()}


        {/* Lista de datos debajo del gráfico */}
        {renderList()}

        {/* Insertar reporte  PLUS */}
        {/*InsertarReporte()*/  }
        </View> 
        <AddButton id_usuario={id_user} nombre={name}  correo={email} patrimonio={budget}/>
        <Footer navigation={navigation} id_usuario={id_user} nombre={name} correo={email} patrimonio={budget} />
    </View>
  );  
};

export default Home_budget;