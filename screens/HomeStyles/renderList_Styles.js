
const renderList_styles = {
    box: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        margin: 2,
      },
      listContainer: {
        height: 180, //Altura
      },
      listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 7,
        borderBottomWidth: 4,
        borderBottomColor: '#E0E0E0',
        color:"black",
        borderRadius: 10,
        
      },
      listText: {
        paddingHorizontal: 8, 
        borderRadius: 5,     
        color: '#000',     
      },
      listAmount: {
        marginLeft: 'auto',   // Empuja el valor hacia la derecha
        marginTop:5,
        fontWeight: 'bold',   // Estilo para el valor
        color: '#000'
      }

}

export default renderList_styles;