import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import firebase from 'react-native-firebase';

const auth = firebase.auth();
const crash = firebase.crashlytics();

class Profile extends Component {
    static navigationOptions = {
        title: 'My profile',
    };

    render() {
        return (
            <View>
                <Text>Profile here</Text>
                <Button
                    onPress={() =>{
                        auth.signOut().then(()=>{
                            this.props.navigation.navigate('Auth')
                          }).catch((err)=>{
                            crash.recordError(1,JSON.stringify(err));
                          });
                    }}
                    title="Logout"
                />
            </View>
        );
    }
}

export default Profile;