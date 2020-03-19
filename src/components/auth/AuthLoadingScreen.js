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
            firebase.firestore().collection('sensies').doc(authUser.uid).get().then((sensieDoc)=>{
              console.log(sensieDoc);
              if(sensieDoc.exists){
                this.props.navigation.navigate('Archipelago');
              }else{
                this.props.navigation.navigate('RegisterSensie');
              }
            })
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