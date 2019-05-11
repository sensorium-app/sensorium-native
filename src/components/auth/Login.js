import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';

const auth = firebase.auth();
const crash = firebase.crashlytics();

class Login extends Component {
    constructor() {
        super();
        
        this.state = {
          username: '',
          password: ''
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
            auth.signInWithEmailAndPassword(this.state.username, this.state.password).then((userResponse)=>{
                //Don't do nothing here since this.authSubscriber takes care of redirection
            }).catch((err)=>{
                crash.recordError(1,JSON.stringify(err));
            });
        }
    }

    render() {
        return (
            <View style={styles.titleWrapper}>
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
                />
                <Button
                    title="Login"
                    type="outline"
                    onPress={this.login}
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
    }
});