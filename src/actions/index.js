import { GET_AUTH_USER, GET_AUTH_USER_SUCCESS, GET_AUTH_USER_FAILURE } from '../constants';
import { fetchUser } from './../api/auth';

export const getAuthUser = () => {
    return {type: GET_AUTH_USER}
}

export const getAuthUserSuccess = (data) => {
    return {type: GET_AUTH_USER_SUCCESS, data}
}

export const getAuthUserFailure = (data) => {
    return {type: GET_AUTH_USER_FAILURE}
}

export const fetchAuthUser = () => {
    return (dispatch) => {
        
        dispatch(getAuthUser())

        fetchUser()
        .then((response) => {
            console.log(response)
            dispatch(getAuthUserSuccess(response))
        })
        .catch((error) => console.log(error))
    }
}