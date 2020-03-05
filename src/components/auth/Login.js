import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import firebase from 'react-native-firebase';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import Loader from './../loader/Loader';

const auth = firebase.auth();
const crash = firebase.crashlytics();

class Login extends Component {
    constructor() {
        super();
        
        this.state = {
          username: '',
          password: '',
          loading: false,
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.login = this.login.bind(this);

        this.authSubscriber = null;
    }

    componentDidMount(){
        this.authSubscriber = firebase.auth().onAuthStateChanged((authUser) => {
            if(authUser){
                this.props.navigation.navigate('App');
            }
        });
    }

    componentWillUnmount() {
        if (this.authSubscriber) {
          this.authSubscriber();
        }
      }

    onTextChange(inputName){
        return (text) => {
            this.setState({ [inputName]: text })
        }
    }

    login(){
        if(!this.state.username || !this.state.password){
            alert('Please provide your identity');
        }else{
            this.setState({
                loading: true,
            });
            auth.signInWithEmailAndPassword(this.state.username, this.state.password).then((userResponse)=>{
                //Don't do nothing here since this.authSubscriber takes care of redirection
            },(err)=>{
                this.setState({
                    loading: false,
                });
                crash.recordError(1,JSON.stringify(err));
                alert('Error');
            }).catch((err)=>{
                this.setState({
                    loading: false,
                });
                alert('Error');
                crash.recordError(1,JSON.stringify(err));
            });
        }
    }

    render() {
        return (
            <View style={styles.titleWrapper}>
                <Image
                    source={require('./../../../assets/img/sensorium.jpeg')}
                    resizeMode={'cover'}
                    style={styles.logo}
                />
                <View style={styles.box}>
                    <Input
                        placeholder='Email'
                        leftIcon={
                            <Icon
                                name='mail'
                                size={24}
                                color='purple'
                            />
                        }
                        onChangeText={this.onTextChange('username')}
                        inputContainerStyle={styles.emailInput}
                        containerStyle={styles.emailInput}
                    />
                    <Input
                        placeholder='Password'
                        leftIcon={
                            <Icon
                                name='lock1'
                                size={24}
                                color='purple'
                            />
                        }
                        onChangeText={this.onTextChange('password')}
                        secureTextEntry={true}
                        inputContainerStyle={styles.passwordInput}
                        containerStyle={styles.passwordInput}
                    />
                    <Button
                        title='Forgot Password?'
                        titleStyle={{
                            color: '#039BE5'
                        }}
                        type='clear'
                        containerStyle={styles.forgotPasswordText}
                    />
                </View>
                {
                    this.state.loading &&
                    <Loader />
                }
                <Button
                    title="Login"
                    onPress={this.login}
                    containerStyle={styles.loginButton}
                />
                <View
                    style={styles.hr}
                />
                <Button
                    title="Register"
                    type="outline"
                    onPress={()=>{
                        this.props.navigation.navigate('Register');
                    }}
                    containerStyle={styles.registerButton}
                />
            </View>
        );
    }
}

export default Login;

const styles = StyleSheet.create({
    titleWrapper: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    emailInput:{
        margin: 10,
    },
    passwordInput:{
        margin: 10,
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
        //marginTop:10,
        //paddingTop:20,
        //paddingBottom:20,
        backgroundColor:'#fff',
        width: '90%',
        //height: 100,
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
    forgotPasswordText: {
        margin: 5,
    },
    loginButton:{
        width: '90%',
        margin: 25,
    },
    hr:{
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        width: '90%'
    },
    registerButton:{
        width: '90%',
        margin: 25,
    }
});