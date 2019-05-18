import { bindActionCreators } from 'redux'
import * as AuthActions from './auth.actions';
import * as MainClusterActions from './mainCluster.actions';
import * as MainClusterPostsActions from './mainClusterPosts.actions';

export const ActionCreators = Object.assign({},
    AuthActions,
    MainClusterActions,
    MainClusterPostsActions
)

export const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(ActionCreators, dispatch);
}