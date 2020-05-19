import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
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
            initials: '',
            aboutme: '',
        };

        this.onChangeText = this.onChangeText.bind(this);
        this.editData = this.editData.bind(this);
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
                        initials: sensieData.initials,
                        aboutme: sensieData.aboutme,
                    });
                }
            });
        }else{
            showAlert('Error', 'Authentication error.');
        }
    }

    onChangeText(inputName,value){
        this.setState({
            [inputName]: value,
        })
    }

    editData(){
        let dataToUpdate = this.state;
        delete dataToUpdate.dateOfBirth;
        delete dataToUpdate.email;

        firebase.firestore().collection('sensies').doc(this.auth)
        .update(dataToUpdate).then(()=>{
            showAlert('Information', 'Data updated.');
        },(err)=>{
            console.log(err);
            showAlert('Error', 'Data not updated.');
        }).catch((err)=>{
            console.log(err);
            showAlert('Error', 'Data not updated.');
        });
    }

    render() {
        return (
            <View style={[Styles.marginTen,Styles.centerContainerHorizontal]}>
            <ScrollView>
                <View style={[Styles.centerHorizontally, {width:'100%',margin:5,}]}>
                    <Avatar 
                        rounded
                        title={this.state.initials}
                        size="xlarge"
                        overlayContainerStyle={{backgroundColor: '#b19cd9'}}
                    />
                    <Input
                        placeholder='Initials'
                        label='Initials'
                        value={this.state.initials}
                        onChangeText={text => this.onChangeText('initials',text)}
                        maxLength={2}
                    />
                    <Input
                        placeholder='Name'
                        label='Name'
                        value={this.state.name}
                        onChangeText={text => this.onChangeText('name', text)}
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
                        editable={false}
                    />
                    <Input
                        placeholder='Name'
                        label='Name'
                        value={this.state.aboutme}
                        multiline={true}
                        onChangeText={text => this.onChangeText('aboutme', text)}
                    />
                        <Button
                            onPress={this.editData}
                            type="outline"
                            title="Save changes"
                            containerStyle={Styles.defaultButton}
                        />
                </View>
            </ScrollView>
            </View>
        );
    }
}

export default EditProfile;