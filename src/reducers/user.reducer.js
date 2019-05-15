
import { GET_AUTH_USER, GET_AUTH_USER_SUCCESS, GET_AUTH_USER_FAILURE } from '../constants';

const initialState =  {
    authUser: {},
    isFetching: false,
    error: false
}

export default userReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_AUTH_USER:
            return {
                ...state,
                authUser: {},
                isFetching: true,
            }
        case GET_AUTH_USER_SUCCESS:
            return {
                ...state,
                authUser: action.data,
                isFetching: false,
            }
        case GET_AUTH_USER_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
            }
        default:
            return state;
    }
}