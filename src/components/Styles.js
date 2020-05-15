import { StyleSheet } from 'react-native';

export default Styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        fontSize: 22,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginTop: 5,
    },
    nameText: {
        fontSize: 32,
        fontWeight: 'bold',
        alignSelf: 'center',
        margin: 5,
    },
    dateOfBirthText: {
        fontSize: 18,
        alignSelf: 'center',
        margin: 5,
    },
    emailText: {
        fontSize: 12,
        alignSelf: 'center',
        margin: 5,
    },
    logo:{
        height: 190,
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    box:{
        marginRight:5,
        marginLeft:5,
        backgroundColor:'#fff',
        width: '90%',
        borderRadius:10,
        borderWidth: 1,
        borderColor: '#68a0cf',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 15,
    },
    marginFive: {
        margin: 5,
    },
    marginTen:{
        margin: 10,
    },
    defaultButton:{
        width: '90%',
        margin: 25,
    },
    hr:{
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        width: '90%'
    },
    centerHorizontally:{
        flexDirection: 'column',
        alignItems: 'center',
    },
    centerContainerHorizontal:{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    footer:{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', 
        bottom: 0,
    }
});