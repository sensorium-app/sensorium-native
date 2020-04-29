import React from 'react';
import {
  View,
} from 'react-native';
import firebase from 'react-native-firebase';
import Loader from './../loader/Loader';
import Styles from './../Styles';

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
      <View style={[Styles.container, {backgroundColor: '#fff'}]}>
        <Loader />
      </View>
    );
  }
}