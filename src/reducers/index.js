import {combineReducers} from 'redux';
import userReducer from './user.reducer';
import mainClusterReducer from './mainCluster.reducer';
import clusterPostsReducer from './clusterPosts.reducer';

export default combineReducers({
    authUser: userReducer,
    mainCluster: mainClusterReducer,
    mainClusterPosts: clusterPostsReducer,
});