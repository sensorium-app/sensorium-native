import {
    GET_CLUSTER_POSTS,
    GET_CLUSTER_POSTS_SUCCESS,
    GET_CLUSTER_POSTS_FAILURE,
    ADD_LIKE_TO_POST,
    GET_POST_DETAIL,
    GET_POST_DETAIL_SUCCESS,
    GET_POST_DETAIL_FAILURE,
} from '../constants';
import {
    fetchMainCluster,
    fetchPosts,
    fetchPost,
    processClusterPosts,
    processClusterPostDetail,
    addLikeToPost
} from '../api/cluster';
import { fetchUser } from './../api/auth';

export const getClusterPosts = () => {
    return {type: GET_CLUSTER_POSTS}
}

export const getClusterPostsSuccess = (data) => {
    return {type: GET_CLUSTER_POSTS_SUCCESS, data}
}

export const getClusterPostsFailure = (data) => {
    return {type: GET_CLUSTER_POSTS_FAILURE}
}

export const addPostLike = () => {
    return { type: ADD_LIKE_TO_POST }
}

export const getPostDetail = () => {
    return { type: GET_POST_DETAIL }
}

export const getPostDetailSuccess = (data) => {
    return { type: GET_POST_DETAIL_SUCCESS, data }
}

export const getPostDetailFailure = () => {
    return { type: GET_POST_DETAIL_FAILURE }
}

export const fetchClusterPosts = () => {
    return (dispatch) => {
        
        dispatch(getClusterPosts())

        fetchUser().then((authUser)=>{
            fetchMainCluster(authUser.uid).then((mainClusterData)=>{
                fetchPosts(mainClusterData.id).onSnapshot((snap)=>{
                    processClusterPosts(snap).then((responseData)=>{
                        dispatch(getClusterPostsSuccess(responseData))
                    }).catch((error)=>{
                        console.log(error);
                    });
                },(error)=>{
                    console.log(error);
                });
            }).catch((error) => console.log(error))
        }).catch((error) => console.log(error))
    }
}

export const fetchPostDetail = (postId) => {
    return (dispatch) => {
        
        dispatch(getPostDetail())

        fetchUser().then((authUser)=>{
            fetchMainCluster(authUser.uid).then((mainClusterData)=>{
                fetchPost(mainClusterData.id, postId).onSnapshot((snap)=>{
                    processClusterPostDetail(snap).then((responseData)=>{
                        dispatch(getPostDetailSuccess(responseData))
                    });
                },(error)=>{
                    console.log(error);
                });
            }).catch((error) => console.log(error))
        }).catch((error) => console.log(error))
    }
}

export const addLike = (postId) => {
    return (dispatch) => {
        fetchUser().then((authUser)=>{
            fetchMainCluster(authUser.uid).then((mainClusterData)=>{
                addLikeToPost(mainClusterData.id, postId, authUser.uid).then((res)=>{
                    dispatch(addPostLike())
                }).catch((err)=>console.log(err));
            }).catch((err)=>console.log(err));
        }).catch((err)=>console.log(err));
    };
};