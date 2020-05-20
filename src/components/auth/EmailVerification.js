import React, { Component } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import Loader from './../loader/Loader';
import Styles from './../Styles';
import { showAlert } from './../misc/Alert';

const auth = firebase.auth();
const crash = firebase.crashlytics();

class EmailVerification extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          username: '',
          loading: false,
        };

        this.sendVerificationEmail = this.sendVerificationEmail.bind(this);
        this.currentUser = auth.currentUser;
    }

    componentDidMount(){
        this.setState({
            username: this.currentUser.email,
        });
    }

    sendVerificationEmail(){
        this.setState({
            loading: true,
        });
        this.currentUser.sendEmailVerification().then(()=>{
            showAlert('Information', 'An email has been sent to verify your email account.');
            this.setState({
                loading: false,
            });
        },(err)=>{
            showAlert('Verification email error', 'Please try again.');
            this.setState({
                loading: false,
            });
            crash.recordError(1,JSON.stringify(err));
        }).catch((err)=>{
            showAlert('Verification email error', 'Connection error. Please try again later.');
            this.setState({
                loading: false,
            });
            crash.recordError(1,JSON.stringify(err));
        });
    }

    render() {
        return (
            <View style={Styles.container}>
                <Image
                    source={require('./../../../assets/img/sensorium.jpeg')}
                    resizeMode={'cover'}
                    style={Styles.logo}
                />
                <Text style={Styles.titleText}>
                    Email needs to be verified
                </Text>
                <View style={Styles.box}>
                    <Text style={styles.text}>
                        Explanation...
                    </Text>
                    <Button
                        title="Resend verification email"
                        onPress={()=>{
                            this.sendVerificationEmail();
                        }}
                        containerStyle={Styles.defaultButton}
                        disabled={this.state.loading}
                    />
                    <View
                        style={Styles.hr}
                    />
                    <Button
                        title="Logout"
                        onPress={() =>{
                            auth.signOut().then(()=>{
                                this.props.navigation.navigate('Login');
                            }).catch((err)=>{
                                crash.recordError(1,JSON.stringify(err));
                            });
                        }}
                        containerStyle={Styles.defaultButton}
                        disabled={this.state.loading}
                    />
                    <View
                        style={Styles.hr}
                    />
                </View>
                {
                    this.state.loading &&
                    <Loader />
                }
            </View>
        );
    }
}

export default EmailVerification;

const styles = StyleSheet.create({
    text: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#fff",
    }
});