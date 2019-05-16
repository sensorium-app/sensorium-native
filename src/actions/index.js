import { bindActionCreators } from 'redux'
import * as AuthActions from './auth.actions';

const AuthCreators = Object.assign({},
    AuthActions,
)

export const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(AuthCreators, dispatch);
}