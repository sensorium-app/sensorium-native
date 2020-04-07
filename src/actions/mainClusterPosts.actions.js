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
    GET_SENSIE_APPROVAL_STATUS,
    GET_SENSIE_APPROVAL_STATUS_SUCCESS,
} from '../constants';
import {
    fetchMainCluster,
    fetchPosts,
    fetchMorePosts,
    fetchPost,
    addClusterPostToApi,
    prepareClusterPostAddition,
    processClusterPosts,
    processClusterPostDetail,
    addLikeToPost,
    reportPost,
    getSensieApprovalStatus,
} from '../api/cluster';
import firebase from 'react-native-firebase';
import { fetchUser } from './../api/auth';

export const getSensieApprovalStatusAction = () => {
    return {type: GET_SENSIE_APPROVAL_STATUS}
}

export const getSensieApprovalStatusSuccess = (data) => {
    return {type: GET_SENSIE_APPROVAL_STATUS_SUCCESS, data}
}

export const fetchSensieApprovalStatus = () => {
    return (dispatch) => {
        
        dispatch(getSensieApprovalStatusAction())

        fetchUser().then((authUser)=>{
            fetchMainCluster(authUser.uid).then((mainClusterData)=>{
                //fetchPosts(mainClusterData.id).onSnapshot((snap)=>{
                getSensieApprovalStatus(mainClusterData.id,authUser.uid).then((data)=>{
                    if(data){
                        //processClusterPosts(snap).then((responseData)=>{
                            dispatch(getSensieApprovalStatusSuccess(data));
                        /*}).catch((error)=>{
                            console.log(error);
                        });*/
                    }else{
                        dispatch(getSensieApprovalStatusSuccess({}))
                    }
                }).catch((error)=>{
                    console.log(error);
                    dispatch(getSensieApprovalStatusSuccess({}))
                });
            }).catch((error) => console.log(error))
        }).catch((error) => console.log(error))
    }
}

export const getClusterPosts = () => {
    return {type: GET_CLUSTER_POSTS}
}

export const getClusterPostsSuccess = (data, lastPostRef) => {
    return {type: GET_CLUSTER_POSTS_SUCCESS, data, lastPostRef}
}

export const getClusterPostsFailure = (data) => {
    return {type: GET_CLUSTER_POSTS_FAILURE}
}

export const getClusterPostsRefresh = () => {
    return {type: GET_CLUSTER_POSTS_REFRESH}
}

export const getClusterPostsRefreshSuccess = (data, lastPostRef) => {
    return {type: GET_CLUSTER_POSTS_REFRESH_SUCCESS, data, lastPostRef}
}

export const getClusterPostsRefreshFailure = (data) => {
    return {type: GET_CLUSTER_POSTS_REFRESH_FAILURE}
}

export const addClusterPost = () => {
    return {type: ADD_CLUSTER_POST}
}

export const addClusterPostSuccess = () => {
    return {type: ADD_CLUSTER_POST_SUCCESS}
}

export const addClusterPostFailure = () => {
    return {type: ADD_CLUSTER_POST_FAILURE}
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

export const addReportPostAction = () => {
    return { type: REPORT_POST }
}

export const addClusterPostAction = (postData) => {
    return (dispatch) => {
        dispatch(addClusterPost())
        fetchUser().then((authUser)=>{
            //fetchMainCluster(authUser.uid).then((mainClusterData)=>{

                //prepareClusterPostAddition(postData, authUser.uid, mainClusterData.id).then((newPostData)=>{
                prepareClusterPostAddition(postData, authUser.uid).then((newPostData)=>{

                    addClusterPostToApi(newPostData).then((res)=>{
                        dispatch(addClusterPostSuccess())
                    }).catch((err)=>{
                        console.log(err)
                        dispatch(addClusterPostFailure())
                    });

                }).catch((err)=>{
                    console.log(err)
                    dispatch(addClusterPostFailure())
                });
            /*}).catch((err)=>{
                console.log(err)
                dispatch(addClusterPostFailure())
            });*/
        }).catch((err)=>{
            console.log(err)
            dispatch(addClusterPostFailure())
        });
    };
}

export const fetchClusterPosts = () => {
    return (dispatch) => {
        
        dispatch(getClusterPosts())

        //fetchUser().then((authUser)=>{
            //fetchMainCluster(authUser.uid).then((mainClusterData)=>{
                //fetchPosts(mainClusterData.id).onSnapshot((snap)=>{
                fetchPosts().onSnapshot((snap)=>{
                    if(snap.size > 0){
                        processClusterPosts(snap).then((responseData)=>{
                            dispatch(getClusterPostsSuccess(responseData, snap.docs[snap.docs.length-1]))
                        }).catch((error)=>{
                            console.log(error);
                        });
                    }else{
                        dispatch(getClusterPostsSuccess([]))
                    }
                },(error)=>{
                    console.log(error);
                });
            //}).catch((error) => console.log(error))
        //}).catch((error) => console.log(error))
    }
}

export const fetchMoreClusterPosts = (lastPostRef) => {
    return (dispatch) => {
        
        dispatch(getClusterPostsRefresh())

        if(lastPostRef == null){
            dispatch(getClusterPostsRefreshSuccess([]))
        }else{
            //fetchUser().then((authUser)=>{
            //fetchMainCluster(authUser.uid).then((mainClusterData)=>{
                //fetchPosts(mainClusterData.id).onSnapshot((snap)=>{
                    fetchMorePosts(lastPostRef).onSnapshot((snap)=>{
                        if(snap.size > 0){
                            processClusterPosts(snap).then((responseData)=>{
                                dispatch(getClusterPostsRefreshSuccess(responseData,snap.docs[snap.docs.length-1]))
                            }).catch((error)=>{
                                console.log(error);
                            });
                        }else{
                            dispatch(getClusterPostsRefreshSuccess([]))
                        }
                    },(error)=>{
                        console.log(error);
                    });
                //}).catch((error) => console.log(error))
            //}).catch((error) => console.log(error))
        }
    }
}

export const fetchPostDetail = (postId) => {
    return (dispatch) => {
        
        dispatch(getPostDetail())

        //fetchUser().then((authUser)=>{
            //fetchMainCluster(authUser.uid).then((mainClusterData)=>{
                //fetchPost(mainClusterData.id, postId).onSnapshot((snap)=>{
                fetchPost(postId).onSnapshot((snap)=>{
                    processClusterPostDetail(snap).then((responseData)=>{
                        dispatch(getPostDetailSuccess(responseData))
                    });
                },(error)=>{
                    console.log(error);
                });
            //}).catch((error) => console.log(error))
        //}).catch((error) => console.log(error))
    }
}

export const addLike = (postId) => {
    return (dispatch) => {
        fetchUser().then((authUser)=>{
            //fetchMainCluster(authUser.uid).then((mainClusterData)=>{
                //addLikeToPost(mainClusterData.id, postId, authUser.uid).then((res)=>{
                addLikeToPost(postId, authUser.uid).then((res)=>{
                    dispatch(addPostLike())
                }).catch((err)=>console.log(err));
            //}).catch((err)=>console.log(err));
        }).catch((err)=>console.log(err));
    };
};

export const addReportPost = (postId) => {
    return (dispatch) => {
        fetchUser().then((authUser)=>{
            //fetchMainCluster(authUser.uid).then((mainClusterData)=>{
                reportPost(postId, authUser.uid).then((res)=>{
                    dispatch(addReportPostAction())
                }).catch((err)=>console.log(err));
            //}).catch((err)=>console.log(err));
        }).catch((err)=>console.log(err));
    };
};