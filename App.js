import React from 'react';
import {Platform} from 'react-native';
import RootStack from './src/config/Routing';
import {Provider} from 'react-redux';
import configureStore from './configureStore'
import FlashMessage from "react-native-flash-message";
import firebase from 'react-native-firebase';
import ServiceUnavailable from './src/components/misc/ServiceUnavailable';
import SplashScreen from 'react-native-splash-screen';

let store = configureStore();

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bootApp: false,
    }
    this.verifyActiveMode = this.verifyActiveMode.bind(this);
  }

  componentDidMount() {
    this.verifyActiveMode();
  }

  verifyActiveMode(){
    firebase.config().setDefaults({
      activeMode: false,
    });
    
    firebase.config().fetch(0)
      .then(() => {
        return firebase.config().activateFetched();
      })
      .then((activated) => {
        console.log(activated);
        if (!activated) console.log('Fetched data not activated');
        return firebase.config().getValue('activeMode');
      })
      .then((snapshot) => {
        const activeMode = snapshot.val();
        console.log(activeMode)
        this.setState({
          bootApp: activeMode,
        },()=>{
          SplashScreen.hide();
        });
      })
      .catch(console.error);
  }

  render() {
    return (
      this.state.bootApp ?
      <Provider store={store}>
        {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
        <RootStack />
        <FlashMessage position="top" />
      </Provider> :
      <ServiceUnavailable/>
    );
  }
}