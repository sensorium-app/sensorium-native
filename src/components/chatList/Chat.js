import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {connect} from 'react-redux';
import { mapDispatchToProps } from './../../actions';
import { GiftedChat } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-crop-picker';

class Chat extends Component {
    static navigationOptions = {
        title: 'Cluster Chat',
    };

    constructor(props) {
        super(props);
        this.state = {
            image: null,
        };
        this.renderAccessoryBar = this.renderAccessoryBar.bind(this);
        this.openImagePicker = this.openImagePicker.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
    }

    componentDidMount(){
        this.props.getChatMessagesAction();
    }

    renderAccessoryBar(){
        return (
            <View style={styles.container}>
                <Icon
                    name='picture'
                    size={32}
                    color='purple'
                    onPress={this.openImagePicker}
                />
            </View>
        )
    }

    openImagePicker(){
        ImagePicker.openPicker({
            cropping: true,
        }).then(image => {
            this.setState({
                image,
            })
        }).catch((err)=>{
            console.log(err);
        });
    }

    onSendMessage(message) {
        if(this.state.image){
            const messageToSend = {
                ...message[0],
                image: this.state.image.path,
                type: 'image',
            }
            this.props.addChatMessageAction([messageToSend]);
        }else{
            this.props.addChatMessageAction(message);
        } 
    }

    render() {
        return (
            
            this.props.authUser.authUser.uid ?
                <GiftedChat
                    messages={this.props.messages}
                    onSend={this.onSendMessage}
                    user={{
                        _id: this.props.authUser.authUser.uid,
                    }}
                    renderAccessory={this.renderAccessoryBar}
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

const styles = StyleSheet.create({
    container: {
        height: 44,
        width: '100%',
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(0,0,0,0.3)',
    },
});