import {
    GET_CHAT_MESSAGES,
    GET_CHAT_MESSAGES_SUCCESS,
    GET_CHAT_MESSAGES_FAILURE,
    ADD_CHAT_MESSAGE,
    ADD_CHAT_MESSAGE_SUCCESS,
    ADD_CHAT_MESSAGE_FAILURE,
} from '../constants';

const initialState =  {
    messages: [],
    unreadMessages:[],
    newMessage: {},
    isFetching: false,
    error: false,
    errorDescription: '',
    pendingApprovals: []
}

export default clusterChatReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_CHAT_MESSAGES:
            return {
                ...state,
                isFetching: true,
            }
        case GET_CHAT_MESSAGES_SUCCESS:
            //console.log(action.pendingApprovals)
            if(action.modified === 'modified'){
                return {
                    ...state,
                    messages: [action.data, ...state.messages ],
                    pendingApprovals: action.pendingApprovals,
                }
            }else{
                return {
                    ...state,
                    messages: action.data,
                    //unreadMessages: action.unread,
                    isFetching: false,
                    pendingApprovals: action.pendingApprovals,
                }
            }
        case GET_CHAT_MESSAGES_FAILURE:
            //console.log(action);
            return {
                ...state,
                isFetching: false,
                error: true,
                errorDescription: action.error,
            }
        case ADD_CHAT_MESSAGE:
            return {
                ...state,
                newMessage: action.data,
                isFetching: true,
            }
        case ADD_CHAT_MESSAGE_SUCCESS:
            return {
                ...state,
                newMessage: {},
                isFetching: false,
            }
        case ADD_CHAT_MESSAGE_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
            }
        default:
            return state;
    }
}