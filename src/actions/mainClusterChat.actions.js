import {
    GET_CHAT_MESSAGES,
    GET_CHAT_MESSAGES_SUCCESS,
    GET_CHAT_MESSAGES_FAILURE,
    ADD_CHAT_MESSAGE,
    ADD_CHAT_MESSAGE_SUCCESS,
    ADD_CHAT_MESSAGE_FAILURE,
} from '../constants';
import {
    fetchChatMessages,
    addChatMessageToApi,
} from './../api/chat';
import { fetchUser } from './../api/auth';
import { fetchMainCluster } from '../api/cluster';
import moment from "moment";

export const getChatMessages = () => {
    return {type: GET_CHAT_MESSAGES}
}

export const getChatMessagesSuccess = (data, modified) => {
    return {type: GET_CHAT_MESSAGES_SUCCESS, data, modified}
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
                    messages.docChanges.forEach((change)=> {
                        
                        let messagesHasPendingWrites = messages.metadata.hasPendingWrites;

                        if(!messagesHasPendingWrites){
                            if (change.type === 'added') {
                                let messagesArray = [];
                                messages.forEach((message,i)=>{
                                    const messageData = message.data();
                                    const messageDate = messageData.date;
                                    const newMessageDate = moment(messageDate.seconds * 1000).toDate();
                                    const newMessageDateMoment = moment(messageDate.seconds * 1000);
                                    const id = message.id;

                                    const newMessageData = {
                                        ...messageData,
                                        _id: id,
                                        createdAt: newMessageDate,
                                        date: newMessageDateMoment,
                                        id: id,
                                    };

                                    messagesArray.push(newMessageData);
                                    
                                });

                                dispatch(getChatMessagesSuccess(messagesArray))
                            }
                        }

                        if (change.type === "modified") {
                            const messageData = change.doc.data();
                            const docId = change.doc.id;
                            const messageDate = messageData.date;
                            const newMessageDate = moment(messageDate.seconds * 1000).toDate();
                            const newMessageDateMoment = moment(messageDate.seconds * 1000);

                            const newMessageData = {
                                ...messageData,
                                _id: docId,
                                createdAt: newMessageDate,
                                date: newMessageDate,
                                dateString: newMessageDateMoment,
                            };

                            dispatch(getChatMessagesSuccess(newMessageData, 'modified'))
                        }
                    });

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