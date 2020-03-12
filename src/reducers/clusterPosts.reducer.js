import {
    GET_CLUSTER_POSTS,
    GET_CLUSTER_POSTS_SUCCESS,
    GET_CLUSTER_POSTS_FAILURE,
    GET_CLUSTER_POSTS_REFRESH,
    GET_CLUSTER_POSTS_REFRESH_SUCCESS,
    GET_CLUSTER_POSTS_REFRESH_FAILURE,
    ADD_CLUSTER_POST,
    ADD_CLUSTER_POST_SUCCESS,
    ADD_CLUSTER_POST_FAILURE,
    ADD_LIKE_TO_POST,
    GET_POST_DETAIL,
    GET_POST_DETAIL_SUCCESS,
    GET_POST_DETAIL_FAILURE,
    REPORT_POST,
} from '../constants';

const initialState =  {
    posts: [],
    postDetail: {},
    isFetching: false,
    error: false,
    lastPostRef: '',
    isRefreshing: false,
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
                lastPostRef: action.lastPostRef
            }
        case GET_CLUSTER_POSTS_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
            }
        case GET_CLUSTER_POSTS_REFRESH:
            return {
                ...state,
                isRefreshing: true,
            }
        case GET_CLUSTER_POSTS_REFRESH_SUCCESS:
            let newPosts = [];
            let lastPostRef = null;
            if(action.data && action.data.length > 0){
                newPosts = state.posts.concat(action.data);
                lastPostRef = action.lastPostRef;
            }else{
                newPosts = [...state.posts];
                lastPostRef = null;
            }
            
            return {
                ...state,
                posts: newPosts,
                isRefreshing: false,
                lastPostRef: lastPostRef,
            }
        case GET_CLUSTER_POSTS_REFRESH_FAILURE:
            return {
                ...state,
                isRefreshing: false,
                error: true,
            }
        case ADD_CLUSTER_POST:{
            return {
                ...state,
                isFetching: true,
            }
        }
        case ADD_CLUSTER_POST_SUCCESS:
            return {
                ...state,
                isFetching: false,
            }
        case ADD_CLUSTER_POST_FAILURE:
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
        case REPORT_POST:
            return state;
        default:
            return state;
    }
}