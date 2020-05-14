import React, { Component } from 'react';
import { View, Text } from 'react-native';
import firebase from 'react-native-firebase';
import { Avatar, Button, Input } from 'react-native-elements';
import Styles from './../Styles';
import moment from "moment";
import { showAlert } from './../misc/Alert';

const auth = firebase.auth();
const crash = firebase.crashlytics();

class EditProfile extends Component {
    static navigationOptions = {
        title: 'Edit profile',
    };

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            dateOfBirth: '',
        };
    }
    

    componentDidMount(){
        this.auth = auth.currentUser.uid;
        if(this.auth){
            firebase.firestore().collection('sensies').doc(this.auth).get().then((sensieDoc)=>{
                console.log(sensieDoc);
                if(sensieDoc.exists){
                    const sensieData = sensieDoc.data();
                    this.setState({
                        email: sensieData.email,
                        name: sensieData.name,
                        dateOfBirth: sensieData.dateOfBirth,
                    });
                }
            });
        }else{
            showAlert('Error', 'Authentication error.');
            
        }
    }

    render() {
        return (
            <View style={[Styles.marginTen,Styles.centerContainerHorizontal]}>
                <View style={[Styles.centerHorizontally, {width:'100%',margin:5,}]}>
                    <Avatar 
                        rounded
                        title="MD"
                        size="xlarge"
                        onPress={() => console.log("must edit")}
                        overlayContainerStyle={{backgroundColor: '#b19cd9'}}
                    />
                    <Input
                        placeholder='Name'
                        label='Name'
                        value={this.state.name}
                        //onChangeText={text => onChangeText(text)}
                    />
                    <Input
                        placeholder='Date of birth'
                        label="Date of birth (can't edit)"
                        value={moment(this.state.dateOfBirth.seconds * 1000).format('MMM D, YYYY')}
                        editable={false}
                    />
                    <Input
                        placeholder='Email'
                        label='Email'
                        value={this.state.email}
                    />
                </View>
            </View>
        );
    }
}

export default EditProfile;