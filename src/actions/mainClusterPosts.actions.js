import { GET_CLUSTER_POSTS, GET_CLUSTER_POSTS_SUCCESS, GET_CLUSTER_POSTS_FAILURE, ADD_LIKE_TO_POST } from '../constants';
import { fetchMainCluster, fetchPosts, processClusterPosts, addLikeToPost } from '../api/cluster';
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