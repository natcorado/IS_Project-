import React, {useState, useEffect} from "react";
import { VictoryPie } from "victory-native";
import{
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    Image,
    ImageBackground,
    TouchableOpacity,
    FlatList,
    Animated,
    Platform

} from 'react-native';


import {COLORS, FONTS, SIZES, icons} from "../constants"


const Home = () => {

    {/*Consts */}


    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        // Obtener la fecha actual y formatearla
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDate(today.toLocaleDateString(undefined, options)); // Esto devuelve la fecha formateada
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
        return(

            <View style = {{paddingHorizontal: SIZES.padding, paddingVertical:SIZES.padding, backgroundColor: COLORS.white}}>
                <View>
                <Text style={{ color: COLORS.darkgray, ...FONTS.h3}}>Good Evening,</Text>
                <Text style={{ color:COLORS.black, ...FONTS.h1, fontSize: 30, fontWeight: 'bold'}}>User</Text>
                <Text style={{ color: COLORS.primary, ...FONTS.h1, fontWeight: 'bold' }}>My budget:</Text>
                <Text style={{ color: COLORS.primary, ...FONTS.largeTitle, fontWeight: 'bold' }}>$25,890.00</Text>

                </View>

                <View style={{flexDirection: 'row' , marginTop: SIZES.padding, alignItems: 'center'}}>
                    <View
                        style={{
                          height: 50,
                          width: 50,
                          backgroundColor: COLORS.lightGray,
                          borderRadius: 25,
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}    
                        >
                        <Image
                            source={icons.calendar}
                            style={{
                                width: 20,
                                height: 20,
                                tintColor: COLORS.lightBlue

                            }}
                        />
                    </View> 
                    <View style={{ marginLeft: SIZES.padding}}>
                        <Text>{currentDate}</Text>     
                        <Text style={{...FONTS.body3, color: COLORS.darkgray}}>18% more than last month</Text>                
                    </View>
                </View>
            </View>
        )
    }

    function renderPieChart() {
        return (
          <View style={{ alignItems: 'center', padding: SIZES.padding }}>
            <Text style={{ ...FONTS.h2, marginBottom: SIZES.base }}>Expenses by category</Text>
    
            <VictoryPie
              data={[
                { x: "House", y: 41.35 },
                { x: "Credit card", y: 21.00 },
                { x: "Food", y: 17.00 },
                { x: "Transport", y: 10.00 },
                { x: "Shopping", y: 10.65 }
              ]}
              colorScale={["#FF5F5F", "#50E3C2", "#4A90E2", "#F8E71C", "#BD10E0"]}
              innerRadius={70}
              labelRadius={90}
              style={{
                labels: {
                  fontSize: 15,
                  fill: COLORS.black
                }
              }}
              width={SIZES.width}
              height={350}
            />
          </View>
        );
      }
    

      function boxesCalendar(){
        const PreviewLayout = ({
            label,
            children,
            values,
            selectedValue,
            setSelectedValue,
          }) => (
            <View style={{padding: 10, flex: 1}}>
              <Text style={styles.label}>{label}</Text>
              <View style={styles.row}>
                {values.map(value => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => setSelectedValue(value)}
                    style={[styles.button, selectedValue === value && styles.selected]}>
                    <Text
                      style={[
                        styles.buttonLabel,
                        selectedValue === value && styles.selectedLabel,
                      ]}>
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
            </View>
          );
          
          const styles = StyleSheet.create({
            row: {
              flexDirection: 'row',
              flexWrap: 'wrap',
            },
            button: {
            
              paddingHorizontal: 8,
              paddingVertical: 6,
              borderRadius: 4,
              backgroundColor: 'oldlace',
              alignSelf: 'flex-center',
              marginHorizontal: '1%',
              marginBottom: 6,
              minWidth: '20%',
              textAlign: 'center',
            },
            selected: {
              backgroundColor: 'coral',
              borderWidth: 0,
            },
            buttonLabel: {
              fontSize: 12,
              fontWeight: '500',
              color: 'coral',
            },
            selectedLabel: {
              color: 'white',
            },
            label: {
              textAlign: 'center',
              marginBottom: 10,
              fontSize: 24,
            },
          });
          
    
        const [direction, setDirection] = useState('ltr');

        return (
          <PreviewLayout
            label="Expenses by category"
            selectedValue={direction}
            values={['lD', '1W' , '1M', '1Y']}
            setSelectedValue={setDirection}>
          </PreviewLayout>
        );
      };
      
     
  return (
    <View style = {{flex:1,backgroundColor: COLORS.lightGray2}}>
        {/* Nav var section */}
        { renderNavBar() }

        {/* Header section */}
        {renderHeader()}

        {boxesCalendar()}

          {/* Pie chart section */}
        {renderPieChart()}
    </View>
  );
};

export default Home;