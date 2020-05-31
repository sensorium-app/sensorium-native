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

class PasswordReset extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          username: '',
          loading: false,
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }

    onTextChange(inputName){
        return (text) => {
            this.setState({ [inputName]: text })
        }
    }

    resetPassword(){
        if(!this.state.username){
            showAlert('Warning', 'Please provide your email address.');
        }else{
            if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.username)){
                showAlert('Warning', 'Please provide a valid email address.');
            }else{
                this.setState({
                    loading: true,
                });
                auth.sendPasswordResetEmail(this.state.username).then((res)=>{
                    this.setState({
                        loading: false,
                    });
                    showAlert('Information', 'An email has been sent to follow up on the password reset.');
                },(err)=>{
                    showAlert('Password reset error', 'Please try again.');
                    this.setState({
                        loading: false,
                    });
                    crash.recordError(13,'PasswordReset - '+JSON.stringify(err));
                }).catch((err)=>{
                    showAlert('Password reset error', 'Connection error. Please try again later.');
                    this.setState({
                        loading: false,
                    });
                    crash.recordError(13,'PasswordReset - '+JSON.stringify(err));
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
                        Password Reset
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
                </View>
                {
                    this.state.loading &&
                    <Loader />
                }
                <Button
                    title="Reset password"
                    onPress={()=>{
                        this.resetPassword();
                    }}
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

export default PasswordReset;