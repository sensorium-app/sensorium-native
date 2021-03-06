import {
    GET_CHAT_MESSAGES,
    GET_CHAT_MESSAGES_SUCCESS,
    GET_CHAT_MESSAGES_FAILURE,
    ADD_CHAT_MESSAGE,
    ADD_CHAT_MESSAGE_SUCCESS,
    ADD_CHAT_MESSAGE_FAILURE,
    SET_MESSAGES_AS_READ,
} from '../constants';
import {
    fetchChatMessages,
    addChatMessageToApi,
    processChatMessages,
    setMessagesAsRead,
} from './../api/chat';
import { fetchUser } from './../api/auth';
import { fetchMainCluster } from '../api/cluster';

export const getChatMessages = () => {
    return {type: GET_CHAT_MESSAGES}
}

export const getChatMessagesSuccess = (data, modified, unread) => {
    return {type: GET_CHAT_MESSAGES_SUCCESS, data, modified, unread}
}

export const getChatMessagesFailure = () => {
    return {type: GET_CHAT_MESSAGES_FAILURE}
}

export const addChatMessage = (data) => {
    return {type: ADD_CHAT_MESSAGE, data}
}

export const addChatMessageSuccess = () => {
    return {type: ADD_CHAT_MESSAGE_SUCCESS}
}

export const addChatMessageFailure = () => {
    return {type: ADD_CHAT_MESSAGE_FAILURE}
}

export const getChatMessagesAction = () => {
    return (dispatch) => {
        dispatch(getChatMessages())

        fetchUser().then((authUser)=>{
            fetchMainCluster(authUser.uid).then((mainClusterData)=>{

                fetchChatMessages(mainClusterData.id).onSnapshot({
                    includeMetadataChanges: true
                },(messages)=>{
                    if(messages.size > 0){
                        processChatMessages(messages,authUser.uid).then((messagesResponse)=>{
                            console.log(messagesResponse);
                            let messsagesArray = messagesResponse.messagesArray;
                            console.log(messsagesArray);
                            let unreadMesssagesArray = messagesResponse.unreadMessagesArray;
                            if(messagesResponse.modified){
                                dispatch(getChatMessagesSuccess(messsagesArray, messagesResponse.modified));
                            }else{
                                dispatch(getChatMessagesSuccess(messsagesArray, null, unreadMesssagesArray));
                            }
                        }).catch((error)=>{
                            console.log(error);
                            dispatch(getChatMessagesFailure())    
                        });
                    }else{
                        let welcomingMessage = {
                            _id: 1,
                            text: 'This is the beginning of your conversation with your cluster. Start now!',
                            createdAt: new Date(),
                            system: true,
                        };
                        dispatch(getChatMessagesSuccess([welcomingMessage]));
                    }

                },(error)=>{
                    console.log(error);
                    dispatch(getChatMessagesFailure())
                });
            }).catch((error) => {
                console.log(error);
                dispatch(getChatMessagesFailure())
            });
        }).catch((error) => {
            console.log(error);
            dispatch(getChatMessagesFailure())
        });

    }
}

export const addChatMessageAction = (newMessage) => {
    return (dispatch) => {
        dispatch(addChatMessage(newMessage[0]))

        fetchUser().then((authUser)=>{
            fetchMainCluster(authUser.uid).then((mainClusterData)=>{
                addChatMessageToApi(newMessage[0], mainClusterData.id, authUser.uid).then(()=>{
                    dispatch(addChatMessageSuccess())
                }).catch((error)=>{
                    console.log(error);
                    dispatch(addChatMessageFailure())
                });
            }).catch((error)=>{
                console.log(error);
                dispatch(addChatMessageFailure())
            });
        }).catch((error)=>{
            console.log(error);
            dispatch(addChatMessageFailure())
        });
    }
}

export const setMessagesAsReadAction = (unreadMessagesArray, clusterId, uid) => {
    return (dispatch) => {
        setMessagesAsRead(unreadMessagesArray, clusterId, uid).then((res)=>{
            console.log(res);
            //dispatch({});
        }).catch((err)=>{
            console.log(err);
            //dispatch({});
        });
    }
}