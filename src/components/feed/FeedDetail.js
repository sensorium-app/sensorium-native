import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

class FeedDetail extends Component {
    static navigationOptions = {
        title: 'Detail',
    };

    constructor(props){
        super(props);
    }

    render() {
        return (
            <View>
                <Text>FeedDetail here</Text>
                <Button
                    onPress={() => this.props.navigation.goBack()}
                    title="Go to back"
                />
            </View>
        );
    }
}

export default FeedDetail;