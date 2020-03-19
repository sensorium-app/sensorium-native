import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import firebase from 'react-native-firebase';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import Loader from './../loader/Loader';
import Styles from './../Styles';
import { showAlert } from './../misc/Alert';

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
                firebase.firestore().collection('sensies').doc(authUser.uid).get().then((sensieDoc)=>{
                    console.log(sensieDoc);
                    if(sensieDoc.exists){
                        this.props.navigation.navigate('App');
                    }else{
                        this.props.navigation.navigate('RegisterSensie');
                    }
                });
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
            showAlert('Warning', 'Please provide your email address and password.');
        }else{
            if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.username)){
                showAlert('Warning', 'Please provide a valid email address.');
            }else{
                this.setState({
                    loading: true,
                });
                auth.signInWithEmailAndPassword(this.state.username, this.state.password).then((userResponse)=>{
                    //Don't do nothing here since this.authSubscriber takes care of redirection
                },(err)=>{
                    showAlert('Login error', 'Your credentials are invalid. Please try again.');
                    this.setState({
                        loading: false,
                    });
                    crash.recordError(1,JSON.stringify(err));
                }).catch((err)=>{
                    showAlert('Login error', 'Connection error. Please try again later.');
                    this.setState({
                        loading: false,
                    });
                    crash.recordError(1,JSON.stringify(err));
                });
            }
        }
    }

    render() {
        return (
            <View style={Styles.container}>
                <Image
                    source={require('./../../../assets/img/sensorium.jpeg')}
                    resizeMode={'cover'}
                    style={Styles.logo}
                />
                <View style={Styles.box}>
                    <Text style={Styles.titleText}>
                        Login
                    </Text>
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
                        inputContainerStyle={Styles.marginTen}
                        containerStyle={Styles.marginTen}
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
                        inputContainerStyle={Styles.marginTen}
                        containerStyle={Styles.marginTen}
                    />
                    <Button
                        title='Forgot Password?'
                        titleStyle={{
                            color: '#039BE5'
                        }}
                        type='clear'
                        containerStyle={Styles.marginFive}
                        onPress={()=>{
                            this.props.navigation.navigate('PasswordReset');
                        }}
                        disabled={this.state.loading}
                    />
                </View>
                {
                    this.state.loading &&
                    <Loader />
                }
                <Button
                    title="Login"
                    onPress={this.login}
                    containerStyle={Styles.defaultButton}
                    disabled={this.state.loading}
                />
                <View
                    style={Styles.hr}
                />
                <Button
                    title="Register"
                    type="outline"
                    onPress={()=>{
                        this.props.navigation.navigate('Register');
                    }}
                    containerStyle={Styles.defaultButton}
                    disabled={this.state.loading}
                />
            </View>
        );
    }
}

export default Login;