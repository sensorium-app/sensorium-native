import {
    GET_CLUSTER_POST_COMMENT,
    GET_CLUSTER_POST_COMMENT_SUCCESS,
    GET_CLUSTER_POST_COMMENT_FAILURE,
} from '../constants';

const initialState =  {
    comments: [],
    isFetching: false,
    error: false
}

export default clusterPostCommentsReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_CLUSTER_POST_COMMENT:
            return {
                ...state,
                comments: [],
                isFetching: true,
            }
        case GET_CLUSTER_POST_COMMENT_SUCCESS:
            return {
                ...state,
                comments: action.data,
                isFetching: false,
            }
        case GET_CLUSTER_POST_COMMENT_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
            }
        default:
            return state;
    }
}