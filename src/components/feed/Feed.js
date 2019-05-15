import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import {fetchAuthUser} from './../../actions';

class Feed extends Component {
    static navigationOptions = {
        title: 'Archipelago',
    };

    constructor(props){
        super(props);
        this.state = {
            authUser: null,
        }
    }

    componentWillMount() {
        this
            .props
            .fetchAuthUser()
    }

    componentDidMount(){
        const { navigation } = this.props;
        const authUser = navigation.getParam('authUser');
        this.setState({
            authUser,
        });
    }

    render() {
        return (
            <View>
                <Text>Feed here</Text>
                {
                    this.props.authUser.isFetching &&
                    <Text>Loading...</Text>
                }
                {
                    this.props.authUser ? 
                    <Text>{JSON.stringify(this.props.authUser)}</Text>
                    :
                    null
                }
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

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchAuthUser: () => {
            return dispatch(fetchAuthUser())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);