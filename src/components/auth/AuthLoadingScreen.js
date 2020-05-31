import React from 'react';
import {
  View,
} from 'react-native';
import firebase from 'react-native-firebase';
import Loader from './../loader/Loader';
import Styles from './../Styles';

const crash = firebase.crashlytics();

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.authUser = null;
    this.userDbRef = null;
    this.authSubscriber = null;
  }

  componentDidMount() {
    this.authSubscriber = firebase.auth().onAuthStateChanged((authUser) => {
        if(authUser){
          this.authUser = authUser;
          this.userDbRef = firebase.firestore().collection('sensies').doc(this.authUser.uid);
          this.userDbRef.get().then((sensieDoc)=>{
              if(sensieDoc.exists){
                this.props.navigation.navigate('Archipelago');
              }else{
                this.props.navigation.navigate('RegisterSensie');
              }
          },(err)=>{
            crash.recordError(10,'AuthLoadingScreen - ' + JSON.stringify(err));
          }).catch((err)=>{ crash.recordError(10,'AuthLoadingScreen - ' + JSON.stringify(err)); })
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