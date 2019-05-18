import { GET_CLUSTER_POSTS, GET_CLUSTER_POSTS_SUCCESS, GET_CLUSTER_POSTS_FAILURE } from '../constants';
import { fetchMainCluster, fetchPosts } from '../api/cluster';
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

export const fetchClusterPosts = () => {
    return (dispatch) => {
        
        dispatch(getClusterPosts())

        fetchUser().then((authUser)=>{
            fetchMainCluster(authUser.uid).then((mainClusterData)=>{
                fetchPosts(mainClusterData.id)
                .then((response) => {
                    dispatch(getClusterPostsSuccess(response))
                })
                .catch((error) => console.log(error))
            }).catch((error) => console.log(error))
        }).catch((error) => console.log(error))
    }
}