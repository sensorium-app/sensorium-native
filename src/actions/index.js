import { bindActionCreators } from 'redux'
import * as AuthActions from './auth.actions';
import * as MainClusterActions from './mainCluster.actions';
import * as MainClusterPostsActions from './mainClusterPosts.actions';
import * as MainClusterPostComments from './mainClusterPostComments.actions';

export const ActionCreators = Object.assign({},
    AuthActions,
    MainClusterActions,
    MainClusterPostsActions,
    MainClusterPostComments,
)

export const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(ActionCreators, dispatch);
}