import { GET_MAIN_CLUSTER, GET_MAIN_CLUSTER_SUCCESS, GET_MAIN_CLUSTER_FAILURE } from '../constants';
import { fetchMainCluster } from '../api/cluster';
import { fetchUser } from './../api/auth';
import firebase from 'react-native-firebase';

const crash = firebase.crashlytics();

export const getCluster = () => {
    return {type: GET_MAIN_CLUSTER}
}

export const getClusterSuccess = (data) => {
    return {type: GET_MAIN_CLUSTER_SUCCESS, data}
}

export const getClusterFailure = (data) => {
    return {type: GET_MAIN_CLUSTER_FAILURE}
}

export const fetchCluster = (uid) => {
    return (dispatch) => {
        
        dispatch(getCluster())

        fetchUser().then((authUser)=>{
            const uid = authUser.uid;
            fetchMainCluster(uid)
            .then((response) => {
                dispatch(getClusterSuccess(response))
            })
            .catch((error) => crash.recordError(3,'mainCluster.actions - ' + JSON.stringify(error)))
        }).catch((error) => crash.recordError(3,'mainCluster.actions - ' + JSON.stringify(error)));
    }
}