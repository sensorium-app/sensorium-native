import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

class ChatList extends Component {
    static navigationOptions = {
        title: 'Cluster Chat',
    };

    render() {
        return (
            <View>
                <Text>ChatList here</Text>
                <Button
                    onPress={() => this.props.navigation.navigate('Chat')}
                    title="Go to specific chat"
                />
            </View>
        );
    }
}

export default ChatList;