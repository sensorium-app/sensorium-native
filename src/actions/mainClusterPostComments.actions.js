import {
    GET_CLUSTER_POST_COMMENT,
    GET_CLUSTER_POST_COMMENT_SUCCESS,
    GET_CLUSTER_POST_COMMENT_FAILURE,
} from '../constants';
import {
    fetchMainCluster,
    fetchClusterPostCommentsFromApi,
    processClusterPosts,
} from '../api/cluster';
import { fetchUser } from './../api/auth';

export const getClusterPostComments = () => {
    return {type: GET_CLUSTER_POST_COMMENT}
}

export const getClusterPostCommentsSuccess = (data) => {
    return {type: GET_CLUSTER_POST_COMMENT_SUCCESS, data}
}

export const getClusterPostCommentsFailure = () => {
    return {type: GET_CLUSTER_POST_COMMENT_FAILURE}
}

export const fetchClusterPostComments = (postId) => {
    return (dispatch) => {
        
        dispatch(getClusterPostComments())

        fetchUser().then((authUser)=>{
            fetchMainCluster(authUser.uid).then((mainClusterData)=>{
                fetchClusterPostCommentsFromApi(mainClusterData.id, postId).onSnapshot((snap)=>{
                    processClusterPosts(snap).then((responseData)=>{   
                        dispatch(getClusterPostCommentsSuccess(responseData))
                    },(error)=>{
                        console.log(error);
                        dispatch(getClusterPostCommentsFailure());
                    }).catch((error)=>{
                        console.log(error);
                        dispatch(getClusterPostCommentsFailure());
                    });
                },(error)=>{
                    console.log(error);
                    dispatch(getClusterPostCommentsFailure());
                });
            }).catch((error) => {
                console.log(error)
                dispatch(getClusterPostCommentsFailure());
            })
        }).catch((error) => {
            console.log(error)
            dispatch(getClusterPostCommentsFailure());
        })
    }
}