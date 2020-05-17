import {
    GET_CHAT_MESSAGES,
    GET_CHAT_MESSAGES_SUCCESS,
    GET_CHAT_MESSAGES_FAILURE,
    ADD_CHAT_MESSAGE,
    ADD_CHAT_MESSAGE_SUCCESS,
    ADD_CHAT_MESSAGE_FAILURE,
    SET_MESSAGES_AS_READ,
    IS_LOADING,
    IS_NOT_LOADING,
} from '../constants';
import {
    fetchChatMessages,
    addChatMessageToApi,
    processChatMessages,
    setMessagesAsRead,
} from './../api/chat';
import { fetchUser } from './../api/auth';
import { 
    fetchMainCluster,
    addSensieApprovalOrDenial,
} from '../api/cluster';

export const isLoading = () =>{
    return {type: IS_LOADING}
}

export const isNotLoading = () =>{
    return {type: IS_NOT_LOADING}
}

export const getChatMessages = () => {
    return {type: GET_CHAT_MESSAGES}
}

export const getChatMessagesSuccess = (data, modified, pendingApprovals, onlySensate) => {
    return {type: GET_CHAT_MESSAGES_SUCCESS, data, modified, pendingApprovals, onlySensate}
}

export const getChatMessagesFailure = (error) => {
    return {type: GET_CHAT_MESSAGES_FAILURE, error}
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
                        //console.log(messages)
                        if(messages.size > 0){
                            processChatMessages(messages,authUser.uid).then((messagesResponse)=>{
                                let messsagesArray = messagesResponse.messagesArray;
                                //console.log(messsagesArray);
                                //let unreadMesssagesArray = messagesResponse.unreadMessagesArray;
                                //if(messagesResponse.modified){
                                    dispatch(getChatMessagesSuccess(messsagesArray, messagesResponse.modified, mainClusterData.pendingApprovals));
                                //}else{
                                    //dispatch(getChatMessagesSuccess(messsagesArray, null, []));
                                //}
                            }).catch((error)=>{
                                console.log(error);
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
                        console.log(error);
                        dispatch(getChatMessagesFailure())
                    });
                }else{
                    dispatch(getChatMessagesFailure('notApproved'))
                }
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
                    console.log(error);
                    dispatch(isNotLoading())
                });
            });
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