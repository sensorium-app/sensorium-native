import React from 'react';

import firebase from 'react-native-firebase';

import ClusterChat from './components/cluster/ClusterChat';
import Login from './components/auth/Login';

export default class App extends React.Component {
  constructor() {
    super();
    this.unsubscriber = null;
    this.state = {
      user: null
    };
  }

  /**
   * Listen for any auth state changes and update component state
   */
  componentDidMount() {
    this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user });
    });
  }

  /**
   * Unsubscribe from the auth listener
   */
  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  render() {
    if (!this.state.user) {
      return <Login />;
    }

    return (
      <ClusterChat />
    );
  }
}
