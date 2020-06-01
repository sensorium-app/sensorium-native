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
    IS_LOADING,
    IS_NOT_LOADING,
} from '../constants';

const initialState =  {
    messages: [],
    unreadMessages:[],
    newMessage: {},
    isFetching: false,
    error: false,
    errorDescription: '',
    pendingApprovals: [],
    onlySensate: false,
    lastChatMessageRef: '',
    isRefreshing: false,
}

export default clusterChatReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_CHAT_MESSAGES:
            return {
                ...state,
                isFetching: true,
            }
        case GET_CHAT_MESSAGES_SUCCESS:
            if(action.modified === 'modified'){
                return {
                    ...state,
                    messages: [action.data, ...state.messages ],
                    pendingApprovals: action.pendingApprovals,
                    onlySensate: action.onlySensate,
                    //lastChatMessageRef: action.lastChatMessageRef,
                }
            }else{
                return {
                    ...state,
                    messages: action.data,
                    //unreadMessages: action.unread,
                    isFetching: false,
                    pendingApprovals: action.pendingApprovals,
                    onlySensate: action.onlySensate,
                    lastChatMessageRef: action.lastChatMessageRef,
                }
            }
        case GET_CHAT_MESSAGES_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
                errorDescription: action.error,
            }
        case GET_CHAT_MESSAGES_REFRESH:
            return {
                ...state,
                isRefreshing: true,
            }
        case GET_CHAT_MESSAGES_REFRESH_SUCCESS:
            let newChatMessages = [];
            let lastChatMessageRef = null;

            if(action.data && action.data.length > 0){
                newChatMessages = state.messages.concat(action.data);
                lastChatMessageRef = action.lastChatMessageRef;
            }else{
                newChatMessages = [...state.messages];
                lastChatMessageRef = null;
            }

            const newArray = [];
            newChatMessages.forEach(obj => {
                if (!newArray.some(o => o.idRef === obj.idRef)) {
                    newArray.push({ ...obj })
                }
            });
            
            return {
                ...state,
                messages: newArray,
                isRefreshing: false,
                lastChatMessageRef: lastChatMessageRef,
            }
        case GET_CHAT_MESSAGES_REFRESH_FAILURE:
            return {
                ...state,
                isRefreshing: false,
                error: true,
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
        case IS_LOADING:
            return {
                ...state,
                isFetching: true,
            }
        case IS_LOADING:
            return {
                ...state,
                isFetching: false,
            }
        default:
            return state;
    }
}