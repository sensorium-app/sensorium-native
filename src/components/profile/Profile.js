import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import firebase from 'react-native-firebase';
import { Avatar, Button } from 'react-native-elements';
import Styles from './../Styles';
import moment from "moment";
import { showAlert } from './../misc/Alert';
import { NavigationEvents } from 'react-navigation';

const auth = firebase.auth();
const crash = firebase.crashlytics();

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height- 40;

class Profile extends Component {
    static navigationOptions = {
        title: 'My profile',
    };

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            dateOfBirth: '',
            initials: '',
            aboutme: '',
        };

        this.logout = this.logout.bind(this);
        this.editProfile = this.editProfile.bind(this);
        this.getUserData = this.getUserData.bind(this);
    }
    

    componentDidMount(){
        this.getUserData();
    }

    getUserData(){
        this.auth = auth.currentUser.uid;
        if(this.auth){
            firebase.firestore().collection('sensies').doc(this.auth).get().then((sensieDoc)=>{
                if(sensieDoc.exists){
                    const sensieData = sensieDoc.data();
                    this.setState({
                        email: sensieData.email,
                        name: sensieData.name,
                        dateOfBirth: sensieData.dateOfBirth,
                        initials: sensieData.initials,
                        aboutme: sensieData.aboutme,
                    });
                }
            });
        }else{
            showAlert('Error', 'Authentication error.');
            
        }
    }

    logout(){
        auth.signOut().then(()=>{
            this.props.navigation.navigate('Auth')
        }).catch((err)=>{
            crash.recordError(20,'Profile - '+JSON.stringify(err));
        });
    }

    editProfile(){
        this.props.navigation.navigate('EditProfile');
    }

    render() {
        return (
            <View style={[Styles.centerContainerHorizontal]}>
                <NavigationEvents
                    onDidFocus={payload => {
                        this.getUserData();
                    }}
                />
                <View style={Styles.centerHorizontally}>
                    <Avatar 
                        rounded
                        title={this.state.initials}
                        size="xlarge"
                        onPress={this.editProfile}
                        overlayContainerStyle={{backgroundColor: '#b19cd9'}}
                    />
                    <Text style={Styles.nameText}>{ this.state.name }</Text>
                    <Text style={Styles.dateOfBirthText}>{ moment(this.state.dateOfBirth.seconds * 1000).format('MMM D, YYYY') }</Text>
                    <Text style={Styles.emailText}>{ this.state.email }</Text>
                    <Text style={Styles.nameText}>About me</Text>
                    <Text style={Styles.emailText}>{ this.state.aboutme }</Text>
                    <Button
                        onPress={this.editProfile}
                        title="Edit"
                        containerStyle={Styles.defaultButton}
                    />
                </View>
                <View style={[Styles.footer]}>
                    <Button
                        onPress={this.logout}
                        type="outline"
                        title="Logout"
                        containerStyle={Styles.defaultButton}
                    />
                </View>
            </View>
        );
    }
}

export default Profile;