import { GET_CLUSTER_POSTS, GET_CLUSTER_POSTS_SUCCESS, GET_CLUSTER_POSTS_FAILURE, ADD_LIKE_TO_POST } from '../constants';

const initialState =  {
    posts: [],
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
        default:
            return state;
    }
}