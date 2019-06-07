import React, { Component } from 'react';
import { Text } from 'react-native';
import {connect} from 'react-redux';
import { mapDispatchToProps } from './../../actions';
import { GiftedChat } from 'react-native-gifted-chat';

class Chat extends Component {
    static navigationOptions = {
        title: 'Cluster Chat',
    };

    componentDidMount(){
        this.props.getChatMessagesAction();
    }

    render() {
        return (
            
            this.props.authUser.authUser.uid ?
                <GiftedChat
                    messages={this.props.messages}
                    onSend={(message) => {
                        this.props.addChatMessageAction(message);
                    }}
                    user={{
                        _id: this.props.authUser.authUser.uid,
                    }}
                /> :
                <Text>Loading...</Text>

        );
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser,
        messages: state.mainClusterChatMessages.messages,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);