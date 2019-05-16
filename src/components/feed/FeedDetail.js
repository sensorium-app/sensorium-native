import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import {connect} from 'react-redux';
import {mapDispatchToProps} from './../../actions';

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
                {
                    this.props.authUser.isFetching &&
                    <Text>Loading...</Text>
                }
                {
                    this.props.authUser ? 
                    <Text>{this.props.authUser.authUser.uid}</Text>
                    :
                    null
                }
                <Button
                    onPress={() => this.props.navigation.goBack()}
                    title="Go to back"
                />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedDetail);