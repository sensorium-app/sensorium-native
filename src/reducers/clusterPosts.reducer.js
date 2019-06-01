import {
    GET_CLUSTER_POSTS,
    GET_CLUSTER_POSTS_SUCCESS,
    GET_CLUSTER_POSTS_FAILURE,
    ADD_LIKE_TO_POST,
    GET_POST_DETAIL,
    GET_POST_DETAIL_SUCCESS,
    GET_POST_DETAIL_FAILURE,
} from '../constants';

const initialState =  {
    posts: [],
    postDetail: {},
    isFetching: false,
    error: false
}

export default clusterPostsReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_CLUSTER_POSTS:
            return {
                ...state,
                posts: [],
                isFetching: true,
            }
        case GET_CLUSTER_POSTS_SUCCESS:
            return {
                ...state,
                posts: action.data,
                isFetching: false,
            }
        case GET_CLUSTER_POSTS_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
            }
        case ADD_LIKE_TO_POST:
            return state;
        case GET_POST_DETAIL:
            return {
                ...state,
                postDetail: {},
                isFetching: true,
            }
        case GET_POST_DETAIL_SUCCESS:
            return {
                ...state,
                postDetail: action.data,
                isFetching: false,
            }
        case GET_POST_DETAIL_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
            }
        default:
            return state;
    }
}