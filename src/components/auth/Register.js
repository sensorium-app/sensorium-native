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

class Register extends Component {
    constructor() {
        super();
        
        this.state = {
          username: '',
          password: '',
          loading: false,
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.register = this.register.bind(this);

        this.authSubscriber = null;
    }

    componentDidMount(){
        this.authSubscriber = firebase.auth().onAuthStateChanged((authUser) => {
            if(authUser){
                this.props.navigation.navigate('RegisterSensie');
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

    register(){
        if(!this.state.username || !this.state.password){
            showAlert('Warning', 'Please provide an email address and a password.');
        }else{
            if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.username)){
                showAlert('Warning', 'Please provide a valid email address.');
            }else{
                if(this.state.username.length <= 6){
                    showAlert('Warning', 'Password should be at least 6 characters please.');
                }else{
                    this.setState({
                        loading: true,
                    });
                    auth.createUserWithEmailAndPassword(this.state.username, this.state.password).then((res)=>{
                        /*auth.signInWithEmailAndPassword(this.state.username, this.state.password).then((userResponse)=>{
                            //Don't do nothing here since this.authSubscriber takes care of redirection
                        },()=>{
                            this.setState({
                                loading: false,
                            });
                        }).catch((err)=>{
                            this.setState({
                                loading: false,
                            });
                            crash.recordError(1,JSON.stringify(err));
                        });*/
                    },(err)=>{
                        this.setState({
                            loading: false,
                        });
                        showAlert('Registration error', 'Please try again.');
                        crash.recordError(1,JSON.stringify(err));
                        //Error: The email address is already in use by another account.
                    }).catch((err)=>{
                        this.setState({
                            loading: false,
                        });
                        showAlert('Registration error', 'Connection error. Please try again later.');
                        crash.recordError(1,JSON.stringify(err));
                    });
                }
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
                        Register
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
                        editable={!this.state.loading}
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
                        editable={!this.state.loading}
                    />
                </View>
                {
                    this.state.loading &&
                    <Loader />
                }
                <Button
                    title="Register"
                    onPress={this.register}
                    containerStyle={Styles.defaultButton}
                    disabled={this.state.loading}
                />
                <View
                    style={Styles.hr}
                />
                <Button
                    title="Back to Login"
                    type="outline"
                    containerStyle={Styles.defaultButton}
                    onPress={()=>{
                        this.props.navigation.navigate('Login');
                    }}
                    disabled={this.state.loading}
                />
            </View>
        );
    }
}

export default Register;