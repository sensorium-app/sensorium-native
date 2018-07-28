import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

export default class Login extends React.Component {
    constructor() {
        super();
        
        this.state = {
          username: '',
          password: ''
        };
      }

    render() {
        return (
            <View style={styles.titleWrapper}>
                <Text>Login would go here.</Text>
                <Text>
                    Loaded dependencies: Firebase and RN Elements.
                </Text>
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