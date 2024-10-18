import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function CRUD() {
    // Estados deben estar dentro del componente funcional
    const [listaTipos, setlistaTipos] = useState([]);
    const [categoria, setCategoria] = useState('');
    const [tipoReporte, setTipoReporte] = useState('');

    // Ejecutar antes de ser renderizado, Conexion al sistema externo, Busca los datos
    useEffect(() => {
        getTipoReportes();
    }, []);

    // Peticion a la API
    const getTipoReportes = async () => {
        try {
            const respuesta = await axios.get('http://192.168.1.9/API/getTiposReportes.php');
           
            setlistaTipos(respuesta.data);
        } catch (error) {
            console.error("Error al obtener los tipos de reportes: ", error);
        }
    };

    const stylespage = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
        },
    });

    return (
        <View style={stylespage.container}>
                <FlatList
                    data={listaTipos}
                    keyExtractor={item => parseInt(item.id_tipo)}
                    renderItem={({ item }) => (
                    <View>
                        <Text>{item.id_tipo|| 'Sin tipo'}</Text>
                        <Text>{item.tipo_reporte || 'Sin tipo'}</Text>
                        <Text>{item.categoria ? item.categoria.trim() : 'Sin categoría'}</Text>
                    </View>
                )}
            />


        </View>
    );
}
