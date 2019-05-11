import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

class Chat extends Component {
    static navigationOptions = {
        title: 'Chat',
    };

    render() {
        return (
            <View>
                <Text>ChatList here</Text>
                <Button
                    onPress={() => this.props.navigation.goBack()}
                    title="Go to back"
                />
            </View>
        );
    }
}

export default Chat;