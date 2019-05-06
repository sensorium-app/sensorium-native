import React from 'react';
import { View, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';
import { Text, Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import Toast, {DURATION} from 'react-native-easy-toast'

const auth = firebase.auth();
const crash = firebase.crashlytics();

export default class Login extends React.Component {
    constructor() {
        super();
        
        this.state = {
          username: '',
          password: ''
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.login = this.login.bind(this);
    }

    onTextChange(inputName){
        return (text) => {
            this.setState({ [inputName]: text })
        }
    }

    login(){
        if(!this.state.username || !this.state.password){
            this.refs.toast.show('Please provide your identity',DURATION.LENGTH_LONG);
        }else{
            auth.signInAndRetrieveDataWithEmailAndPassword(this.state.username, this.state.password).then((userResponse)=>{
                alert('In');
            }).catch((err)=>{
                console.log(err);
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
                />
                <Button
                    title="Login"
                    type="outline"
                    onPress={this.login}
                />
                <Toast
                    ref="toast"
                    style={{backgroundColor:'orange'}}
                    position='top'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                />
            </View>
        );
    }
}

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