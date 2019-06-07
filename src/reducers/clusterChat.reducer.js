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
    newMessage: {},
    isFetching: false,
    error: false
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
                }
            }else{
                return {
                    ...state,
                    messages: action.data,
                    isFetching: false,
                }
            }
        case GET_CHAT_MESSAGES_FAILURE:
            return {
                ...state,
                isFetching: false,
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
        default:
            return state;
    }
}