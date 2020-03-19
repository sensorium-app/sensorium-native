import React, { Component } from 'react';
import { Text, View } from 'react-native';
import firebase from 'react-native-firebase';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import Loader from './../loader/Loader';
import Styles from './../Styles';
import { showAlert } from './../misc/Alert';
import DatePicker from 'react-native-datepicker'

const auth = firebase.auth();
const crash = firebase.crashlytics();

class RegisterSensie extends Component {
    constructor() {
        super();
        
        this.state = {
            uid: '',
            name: '',
            lastName: '',
            secondLastName:'',
            email: '',
            gender: '',
            dateOfBirth: '1995-01-01',
            skills:{},
            hobbies: {},
            interests:{},
            languagesSpoken:{},
            desiredClusters: {
                dateTimeOfBirth: false,
                monthAndDay: true,
                monthAndYear: false,
                month: false,
                skills: false,
                hobbies: false,
                interests: false,
            },
            loading: false,
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.registerData = this.registerData.bind(this);

        this.authSubscriber = null;
    }

    componentDidMount(){
        this.authSubscriber = auth.onAuthStateChanged((authUser) => {
            if(authUser){
                this.setState({
                    uid: authUser.uid,
                    email: authUser.email,
                })
            }
        });
    }

    componentWillUnmount() {
        if (this.authSubscriber) {
          this.authSubscriber();
        }
      }

    onTextChange(inputName){
        return (text) => {
            this.setState({ [inputName]: text })
        }
    }

    registerData(){
        if(!this.state.name){
            showAlert('Warning', 'Please provide the required information.');
        }else{
            this.setState({
                loading: true,
            });

            const sensate = {
                uid: this.state.uid,
                name: this.state.name,
                lastName: this.state.lastName,
                secondLastName:this.state.secondLastName,
                email: this.state.email,
                gender: this.state.gender,
                dateOfBirth: this.state.dateOfBirth,
                skills:{},
                hobbies: {},
                interests:{},
                languagesSpoken:{},
                desiredClusters: {
                    dateTimeOfBirth: this.state.dateOfBirthCluster,
                    monthAndDay: this.state.monthAndDayCluster,
                    monthAndYear: this.state.monthAndYearCluster,
                    month: this.state.monthCluster,
                    skills: this.state.skillsCluster,
                    hobbies: this.state.hobbiesCluster,
                    interests: this.state.interestsCluster
                }
              };

            firebase.firestore().collection('sensies').doc(this.state.uid).set(sensate).then((res)=>{
                this.props.navigation.navigate('App');
            },(err)=>{
                this.setState({
                    loading: false,
                });
                crash.recordError(1,JSON.stringify(err));
                console.log(err);
                showAlert('Error', 'Error registering.');
            });
        }
    }

    render() {
        return (
            <View style={Styles.container}>
                <View style={Styles.box}>
                    <Text style={Styles.titleText}>
                        Let us know a bit about you.
                    </Text>
                    <Input
                        placeholder='Name'
                        leftIcon={
                            <Icon
                                name='user'
                                size={24}
                                color='purple'
                            />
                        }
                        onChangeText={this.onTextChange('name')}
                        inputContainerStyle={Styles.marginTen}
                        containerStyle={Styles.marginTen}
                    />
                    <DatePicker
                        style={{width: 200}}
                        date={this.state.dateOfBirth}
                        mode="date"
                        placeholder="Select date of birth"
                        format="YYYY-MM-DD"
                        minDate="1990-01-01"
                        maxDate="2020-12-31"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36
                        }
                        }}
                        onDateChange={(date) => {this.setState({dateOfBirth: date})}}
                    />
                </View>
                {
                    this.state.loading &&
                    <Loader />
                }
                <Button
                    title="Go ahead"
                    onPress={this.registerData}
                    containerStyle={Styles.defaultButton}
                    disabled={this.state.loading}
                />
                <View
                    style={Styles.hr}
                />
                <Button
                    onPress={() =>{
                        auth.signOut().then(()=>{
                            this.props.navigation.navigate('Auth')
                          }).catch((err)=>{
                            crash.recordError(1,JSON.stringify(err));
                            this.props.navigation.navigate('Auth')
                          });
                    }}
                    title="Logout"
                    containerStyle={Styles.defaultButton}
                />
            </View>
        );
    }
}

export default RegisterSensie;