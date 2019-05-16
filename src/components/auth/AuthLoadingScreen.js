import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  View,
} from 'react-native';
import firebase from 'react-native-firebase';

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.authSubscriber = null;
  }

  componentDidMount() {
    this.authSubscriber = firebase.auth().onAuthStateChanged((authUser) => {
        if(authUser){
            this.props.navigation.navigate('Feed');
        }else{
            this.props.navigation.navigate('Auth');
        }
    });
  }

  componentWillUnmount() {
    if (this.authSubscriber) {
      this.authSubscriber();
    }
  }

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}