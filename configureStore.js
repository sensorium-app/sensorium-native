import {createStore, applyMiddleware} from 'redux';
import reducers from './src/reducers';
import thunk from 'redux-thunk';

export default configureStore = () => {
    let store = createStore(reducers, applyMiddleware(thunk));
    return store;
}