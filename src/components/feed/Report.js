import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { withNavigation } from 'react-navigation';
import {connect} from 'react-redux';
import { mapDispatchToProps } from './../../actions';

class Report extends Component {
    static navigationOptions = {
        title: 'Report Post',
    };

    constructor(props) {
        super(props);
        this.postId = this.props.navigation.state.params.postIdRef;
    }

    render() {
        return (
            <View>
                <Text>Report a post...</Text>
        <Text>{ this.postId}</Text>
                <Button
                    onPress={() =>{
                        this.props.addReportPost(this.postId);
                        //alert('Thank you for your report');
                        //this.props.navigation.navigate('Archipelago');
                    }}
                    title="Send report"
                />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(Report));