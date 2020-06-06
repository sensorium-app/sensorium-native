import {
    GET_CHAT_MESSAGES,
    GET_CHAT_MESSAGES_SUCCESS,
    GET_CHAT_MESSAGES_FAILURE,
    GET_CHAT_MESSAGES_REFRESH,
    GET_CHAT_MESSAGES_REFRESH_SUCCESS,
    GET_CHAT_MESSAGES_REFRESH_FAILURE,
    ADD_CHAT_MESSAGE,
    ADD_CHAT_MESSAGE_SUCCESS,
    ADD_CHAT_MESSAGE_FAILURE,
    SET_MESSAGES_AS_READ,
    IS_LOADING,
    IS_NOT_LOADING,
} from '../constants';
import {
    fetchChatMessages,
    fetchMoreChatMessages,
    addChatMessageToApi,
    processChatMessages,
    setMessagesAsRead,
} from './../api/chat';
import { fetchUser } from './../api/auth';
import { 
    fetchMainCluster,
    addSensieApprovalOrDenial,
} from '../api/cluster';
import firebase from 'react-native-firebase';
const crash = firebase.crashlytics();

export const isLoading = () =>{
    return {type: IS_LOADING}
}

export const isNotLoading = () =>{
    return {type: IS_NOT_LOADING}
}

export const getChatMessages = () => {
    return {type: GET_CHAT_MESSAGES}
}

export const getChatMessagesSuccess = (data, modified, pendingApprovals, onlySensate, lastChatMessageRef) => {
    return {type: GET_CHAT_MESSAGES_SUCCESS, data, modified, pendingApprovals, onlySensate, lastChatMessageRef}
}

export const getChatMessagesFailure = (error) => {
    return {type: GET_CHAT_MESSAGES_FAILURE, error}
}

export const getChatMessagesRefresh = () => {
    return {type: GET_CHAT_MESSAGES_REFRESH}
}

export const getChatMessagesRefreshSuccess = (data, lastChatMessageRef) => {
    return {type: GET_CHAT_MESSAGES_REFRESH_SUCCESS, data, lastChatMessageRef}
}

export const getChatMessagesRefreshFailure = (data) => {
    return {type: GET_CHAT_MESSAGES_REFRESH_FAILURE}
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
                if(mainClusterData.approved){
                    fetchChatMessages(mainClusterData.id).onSnapshot({
                        includeMetadataChanges: true
                    },(messages)=>{
                        if(messages.size > 0){
                            processChatMessages(messages,authUser.uid).then((messagesResponse)=>{
                                let messsagesArray = messagesResponse.messagesArray;
                                //let unreadMesssagesArray = messagesResponse.unreadMessagesArray;
                                //if(messagesResponse.modified){
                                    dispatch(getChatMessagesSuccess(messsagesArray, messagesResponse.modified, mainClusterData.pendingApprovals, false, messages.docs[messages.docs.length-1]));
                                //}else{
                                    //dispatch(getChatMessagesSuccess(messsagesArray, null, []));
                                //}
                            }).catch((error)=>{
                                crash.recordError(3,'mainClusterChat.actions - ' + JSON.stringify(error));
                                dispatch(getChatMessagesFailure())    
                            });
                        }else{

                            let approvedSensies = 0;

                            Object.keys(mainClusterData.sensates).forEach((sensie)=>{
                                if(mainClusterData.sensates[sensie]){
                                    approvedSensies++;
                                }
                            });

                            if(approvedSensies > 1){
                                let welcomingMessage = {
                                    _id: 1,
                                    text: 'This is the beginning of your conversation with your cluster. Start now!',
                                    createdAt: new Date(),
                                    system: true,
                                };
                                dispatch(getChatMessagesSuccess([welcomingMessage], null, mainClusterData.pendingApprovals));
                            }else{
                                dispatch(getChatMessagesSuccess([], null, mainClusterData.pendingApprovals, true));
                            }
                        }
    
                    },(error)=>{
                        crash.recordError(3,'mainClusterChat.actions - ' + JSON.stringify(error));
                        dispatch(getChatMessagesFailure())
                    });
                }else{
                    dispatch(getChatMessagesFailure('notApproved'))
                }
            }).catch((error) => {
                crash.recordError(3,'mainClusterChat.actions - ' + JSON.stringify(error));
                dispatch(getChatMessagesFailure())
            });
        }).catch((error) => {
            crash.recordError(3,'mainClusterChat.actions - ' + JSON.stringify(error));
            dispatch(getChatMessagesFailure())
        });

    }
}

export const getMoreChatMessagesAction = (lastChatMessageRef) => {
    return (dispatch) => {
        dispatch(getChatMessages())

        if(lastChatMessageRef == null){
            dispatch(getChatMessagesSuccess([]))
        }else{
            fetchUser().then((authUser)=>{
                fetchMainCluster(authUser.uid).then((mainClusterData)=>{
                    fetchMoreChatMessages(mainClusterData.id, lastChatMessageRef).onSnapshot({
                        includeMetadataChanges: true
                    },(messages)=>{
                        if(messages.size > 0){
                            processChatMessages(messages,authUser.uid).then((messagesResponse)=>{
                                let messsagesArray = messagesResponse.messagesArray;
                                //let unreadMesssagesArray = messagesResponse.unreadMessagesArray;
                                //if(messagesResponse.modified){
                                    dispatch(getChatMessagesRefreshSuccess(messsagesArray, messages.docs[messages.docs.length-1]));
                                //}else{
                                    //dispatch(getChatMessagesSuccess(messsagesArray, null, []));
                                //}
                            }).catch((error)=>{
                                crash.recordError(3,'mainClusterChat.actions - ' + JSON.stringify(error));
                                dispatch(getChatMessagesRefreshFailure())    
                            });
                        }else{
                            dispatch(getChatMessagesRefreshSuccess([]));
                        }
    
                    },(error)=>{
                        crash.recordError(3,'mainClusterChat.actions - ' + JSON.stringify(error));
                        dispatch(getChatMessagesRefreshFailure())
                    });
                }).catch((error) => {
                    crash.recordError(3,'mainClusterChat.actions - ' + JSON.stringify(error));
                    dispatch(getChatMessagesRefreshFailure())
                });
            }).catch((error) => {
                crash.recordError(3,'mainClusterChat.actions - ' + JSON.stringify(error));
                dispatch(getChatMessagesRefreshFailure())
            });
        }

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
                    crash.recordError(3,'mainClusterChat.actions - ' + JSON.stringify(error));
                    dispatch(addChatMessageFailure())
                });
            }).catch((error)=>{
                crash.recordError(3,'mainClusterChat.actions - ' + JSON.stringify(error));
                dispatch(addChatMessageFailure())
            });
        }).catch((error)=>{
            crash.recordError(3,'mainClusterChat.actions - ' + JSON.stringify(error));
            dispatch(addChatMessageFailure())
        });
    }
}

export const addSensieApprovalOrDenialAction = (uid, status) => {
    return (dispatch) => {
        dispatch(isLoading())
        fetchUser().then((authUser)=>{
            fetchMainCluster(authUser.uid).then((mainClusterData)=>{
                addSensieApprovalOrDenial(uid, status, mainClusterData.id, authUser.uid)
                .then(()=>{
                    dispatch(isNotLoading())
                })
                .catch((error)=>{
                    crash.recordError(3,'mainClusterChat.actions - ' + JSON.stringify(error));
                    dispatch(isNotLoading())
                });
            });
        });
    }
}

export const setMessagesAsReadAction = (unreadMessagesArray, clusterId, uid) => {
    return (dispatch) => {
        setMessagesAsRead(unreadMessagesArray, clusterId, uid).then((res)=>{
            //dispatch({});
        }).catch((err)=>{
            //dispatch({});
        });
    }
}