import React from 'react';
import RootStack from './src/config/Routing';
import {Provider} from 'react-redux';
import configureStore from './configureStore'
import FlashMessage from "react-native-flash-message";

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
        <FlashMessage position="top" />
      </Provider>
    );
  }
}