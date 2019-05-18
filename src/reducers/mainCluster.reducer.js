import { GET_MAIN_CLUSTER, GET_MAIN_CLUSTER_SUCCESS, GET_MAIN_CLUSTER_FAILURE } from '../constants';

const initialState =  {
    mainClusterData: {},
    isFetching: false,
    error: false
}

export default mainClusterReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_MAIN_CLUSTER:
            return {
                ...state,
                mainClusterData: {},
                isFetching: true,
            }
        case GET_MAIN_CLUSTER_SUCCESS:
            return {
                ...state,
                mainClusterData: action.data,
                isFetching: false,
            }
        case GET_MAIN_CLUSTER_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
            }
        default:
            return state;
    }
}