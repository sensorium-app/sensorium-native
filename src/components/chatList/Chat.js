import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground } from 'react-native';
import { Button } from 'react-native-elements';
import {connect} from 'react-redux';
import { mapDispatchToProps } from './../../actions';
import { GiftedChat, Send, Actions, SystemMessage, Bubble } from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/AntDesign';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import Loader from './../loader/Loader';
import Styles from './../Styles';
import SensieApproval from './SensieApproval';

class Chat extends Component {
    static navigationOptions = {
        title: 'Cluster Chat',
    };

    constructor(props) {
        super(props);
        this.state = {
            image: null,
        };
        //this.markedAsRead = false;
        this.openImagePicker = this.openImagePicker.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
        this.renderChatFooter = this.renderChatFooter.bind(this);
        this.deleteImageToSend = this.deleteImageToSend.bind(this);
        this.renderCustomActions = this.renderCustomActions.bind(this);
    }

    componentDidMount(){
        this.props.fetchAuthUser();
        this.props.fetchCluster();
        this.props.getChatMessagesAction();
        //console.log(this.props.pendingApprovals);
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
        //console.log(this.props.onlySensate);
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

    renderCustomActions(props){
        const options = {
            'Select an image': (props) => {
              this.openImagePicker();
            },
            'Cancel': () => {
              console.log('cancel');
            }
          };
          return (
            <Actions {...props} options={options} />
          );
    }

    renderSystemMessage = props => {
        return (
          <SystemMessage
            {...props}
            containerStyle={{
                marginHorizontal: 10,
                marginBottom: 15,
            }}
            textStyle={{
              fontSize: 18,
            }}
          />
        )
    }

    renderBubble = props => {
        return (
          <Bubble
            {...props}
            wrapperStyle={{
              left: {
                backgroundColor: props.currentMessage.readByMe ? '#808080' : '#fce4ec',
              },
            }}
          />
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
            this.setState({
                image: null,
            })
        }else{
            this.props.addChatMessageAction(message);
        } 
    }

    renderChat(){
        return(
            <View style={{flex: 1}}>
                {
                    this.props.messages
                    && this.props.authUser &&
                    
                        this.props.pendingApprovals.length > 0 &&
                    
                    <SensieApproval pendingApprovals={this.props.pendingApprovals} />
                }
                <GiftedChat
                    placeholder={'Type a message to share...'}
                    messages={this.props.messages}
                    onSend={this.onSendMessage}
                    user={{
                        _id: this.props.authUser.authUser.uid,
                    }}
                    renderAccessory={this.renderAccessoryBar}
                    renderUsernameOnMessage={true}
                    renderChatFooter={this.renderChatFooter}
                    renderSend={ 
                         this.renderSend
                    }
                    renderLoading={()=> {return <Loader />}}
                    renderActions={this.renderCustomActions}
                    renderSystemMessage={this.renderSystemMessage}
                    //renderBubble={this.renderBubble}
                />
            </View>
        )
    }

    renderNavigateToArchipelago(){
        return (
            <View>
                <Text style={Styles.marginTen}>
                    In the meantime you can navigate to the archipelago section to 
                    intereact with sensies outside of your cluster.
                </Text>
                <Button
                    title="Archipelago"
                    type="outline"
                    onPress={()=>{
                        this.props.navigation.navigate('Archipelago');
                    }}
                    containerStyle={[Styles.defaultButton]}
                />
            </View>
        )
    }

    renderApprovalPending(){
        return (
            <View style={Styles.container}>
                <Text style={[Styles.marginTen,{
                    fontSize: 20,
                    color: 'purple',
                }]}>
                    Successfully joined into a cluster!
                </Text>
                <Text style={[Styles.marginTen,{
                    fontSize: 15,
                    color: 'purple',
                }]}>
                    You have been matched in a cluster but all the current members
                    must approve for security reasons.
                </Text>
                <Text style={[Styles.marginTen, {
                    color: '#2099dc',
                }]}>
                    In the meantime you can navigate to the archipelago section to 
                    intereact with sensies outside of your cluster.
                </Text>
                <Button
                    title="Archipelago"
                    type="outline"
                    onPress={()=>{
                        this.props.navigation.navigate('Archipelago');
                    }}
                    containerStyle={[Styles.defaultButton]}
                />
            </View>
        );
    }

    render() {
        //if(!this.props.mainCluster.isFetching && this.props.authUser){
            /*if(!this.markedAsRead){
                setTimeout(() => {
                    this.markedAsRead = true;
                    console.log('mark as read init')
                    this.props.setMessagesAsReadAction(
                        this.props.unreadMessages, 
                        this.props.mainCluster.mainClusterData.id, 
                        this.props.authUser.authUser.uid
                    );
                    console.log('mark as read end')
                }, 5000);
            }*/
        //}
        return (

            (this.props.errorDescription == 'notApproved') ?
                this.renderApprovalPending()
            :
            (
                !this.props.messages
                && !this.props.authUser
            ) ?
            <Loader /> :
             this.renderChat()
        );
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser,
        mainCluster: state.mainCluster,
        isLoadingMessages: state.mainClusterChatMessages.isFetching,
        messages: state.mainClusterChatMessages.messages,
        errorDescription: state.mainClusterChatMessages.errorDescription,
        pendingApprovals: state.mainClusterChatMessages.pendingApprovals,
        onlySensate: state.mainClusterChatMessages.onlySensate,
        //unreadMessages: state.mainClusterChatMessages.unreadMessages,
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