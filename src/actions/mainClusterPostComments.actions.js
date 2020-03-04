import {
    GET_CLUSTER_POST_COMMENT,
    GET_CLUSTER_POST_COMMENT_SUCCESS,
    GET_CLUSTER_POST_COMMENT_FAILURE,
    ADD_COMMENT_TO_POST,
    ADD_COMMENT_TO_POST_SUCCESS,
    ADD_COMMENT_TO_POST_FAILURE,
} from '../constants';
import {
    fetchMainCluster,
    fetchClusterPostCommentsFromApi,
    addClusterPostCommentToApi,
    processClusterPosts,
} from '../api/cluster';
import { fetchUser } from './../api/auth';
import firebase from 'react-native-firebase';

export const getClusterPostComments = () => {
    return {type: GET_CLUSTER_POST_COMMENT}
}

export const getClusterPostCommentsSuccess = (data) => {
    return {type: GET_CLUSTER_POST_COMMENT_SUCCESS, data}
}

export const getClusterPostCommentsFailure = () => {
    return {type: GET_CLUSTER_POST_COMMENT_FAILURE}
}

export const addClusterPostComment = () => {
    return {type: ADD_COMMENT_TO_POST}
}

export const addClusterPostCommentSuccess = () => {
    return {type: ADD_COMMENT_TO_POST_SUCCESS}
}

export const addClusterPostCommentFailure = () => {
    return {type: ADD_COMMENT_TO_POST_FAILURE}
}

export const fetchClusterPostComments = (postId) => {
    return (dispatch) => {
        
        dispatch(getClusterPostComments())

        //fetchUser().then((authUser)=>{
            //fetchMainCluster(authUser.uid).then((mainClusterData)=>{
                fetchClusterPostCommentsFromApi(postId).onSnapshot((snap)=>{
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
            /*}).catch((error) => {
                console.log(error)
                dispatch(getClusterPostCommentsFailure());
            })*/
        /*}).catch((error) => {
            console.log(error)
            dispatch(getClusterPostCommentsFailure());
        })*/
    }
}

export const addClusterPostCommentAction = (postId, text) => {
    return (dispatch) => {
        dispatch(addClusterPostComment())

        fetchUser().then((authUser)=>{
            //fetchMainCluster(authUser.uid).then((mainClusterData)=>{
                
                let newCommentData = {
                    text,
                    type: 'text',
                    date: firebase.firestore.FieldValue.serverTimestamp(),
                    user: {
                        _id: authUser.uid,
                        avatar: 'users/kUnv9WuFTlgwMMSpxTydFXf438A2/profilepic.48824a70.png',
                        name: 'tempUser',
                    },
                };

                addClusterPostCommentToApi(postId, newCommentData).then(()=>{
                    dispatch(addClusterPostCommentSuccess())
                }).catch((err)=>{
                    console.log(err);
                    dispatch(addClusterPostCommentFailure())
                });
            /*}).catch((err)=> {
                console.log(err);
                dispatch(addClusterPostCommentFailure())    
            })*/
        }).catch((err)=>{
            console.log(err);
            dispatch(addClusterPostCommentFailure())
        });
    }
}