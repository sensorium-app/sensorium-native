import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import firebase from 'react-native-firebase';

class Feed extends Component {
    static navigationOptions = {
        title: 'Archipelago',
    };

    constructor(props){
        super(props);
    }

    render() {
        return (
            <View>
                <Text>Feed here</Text>
                <Button
                    onPress={() => this.props.navigation.navigate('FeedDetail')}
                    title="Go to FeedDetail"
                />
                <Button
                    onPress={() => this.props.navigation.navigate('ChatList')}
                    title="Go to ChatList"
                />
                <Button
                    onPress={() => this.props.navigation.navigate('Profile')}
                    title="Go to Profile"
                />
            </View>
        );
    }
}

export default Feed;