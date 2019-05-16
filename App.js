import React from 'react';
import RootStack from './src/config/Routing';
import {Provider} from 'react-redux';
import configureStore from './configureStore'

let store = configureStore();

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {

  }

  render() {
    return (
      <Provider store={store}>
        <RootStack />
      </Provider>
    );
  }
}