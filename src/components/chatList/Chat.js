import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground } from 'react-native';
import {connect} from 'react-redux';
import { mapDispatchToProps } from './../../actions';
import { GiftedChat, Send, Composer } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/AntDesign';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import Loader from './../loader/Loader';

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
        this.renderChatFooter = this.renderChatFooter.bind(this);
        this.deleteImageToSend = this.deleteImageToSend.bind(this);
    }

    componentDidMount(){
        this.props.fetchAuthUser();
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

    renderChatFooter(){
        if(this.state.image){
            return (
                <View>
                    <ImageBackground
                        source={{ uri: this.state.image.path }}
                        style={{ height: 75, width: 75 }}
                    >
                        <Icon
                            name='closecircle'
                            size={24}
                            color='purple'
                            onPress={this.deleteImageToSend}
                        />
                    </ImageBackground>
                </View>
            )
        }
        return null;
    }

    deleteImageToSend(){
        this.setState({
            image: null,
        })
    }

    renderSend(props){
        return (
            <Send
                {...props}
            >
                <View>
                    <IconMaterial
                        name='send'
                        size={32}
                        color='purple'
                    />
                </View>
            </Send>
        );
    }

    renderComposer(props){
        return (
            <View style={{flexDirection: 'row'}}>
                <Icon
                    name='picture'
                    size={32}
                    color='purple'
                    onPress={this.openImagePicker}
                    style={{ fontSize: 20, justifyContent: 'center', paddingTop: 10, paddingLeft: 5 }}
                />
                <Composer {...props} />
                <Send
                    {...props}
                >
                    <View>
                        <IconMaterial
                            name='send'
                            size={32}
                            color='purple'
                        />
                    </View>
                </Send>
            </View>
        );
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
            this.setState({
                image: null,
            })
        }else{
            this.props.addChatMessageAction(message);
        } 
    }

    render() {
        return (

            (
                !this.props.messages
                && !this.props.authUser
            ) ?
            <Loader /> :
            <GiftedChat
                messages={this.props.messages}
                onSend={this.onSendMessage}
                user={{
                    _id: this.props.authUser.authUser.uid,
                }}
                renderAccessory={this.renderAccessoryBar}
                renderUsernameOnMessage={true}
                renderChatFooter={this.renderChatFooter}
                renderSend={this.renderSend}
                renderLoading={()=> {return <Loader />}}
                renderComposer={this.renderComposer}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser,
        isLoadingMessages: state.mainClusterChatMessages.isFetching,
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