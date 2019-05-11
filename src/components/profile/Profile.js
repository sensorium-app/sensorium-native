import React, { Component } from 'react';
import { View, Text } from 'react-native';

class Profile extends Component {
    static navigationOptions = {
        title: 'My profile',
    };

    render() {
        return (
            <View>
                <Text>Profile here</Text>
            </View>
        );
    }
}

export default Profile;