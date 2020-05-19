import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import firebase from 'react-native-firebase';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import Loader from './../loader/Loader';
import Styles from './../Styles';
import { showAlert } from './../misc/Alert';
import DatePicker from 'react-native-datepicker';
import moment from "moment";

const auth = firebase.auth();
const crash = firebase.crashlytics();

class RegisterSensie extends Component {
    constructor() {
        super();

        const newDate = new Date();
        const maxDate = moment(newDate).subtract(16, 'years').toDate();
        const minDate = moment(newDate).subtract(100, 'years').toDate();
        
        this.state = {
            uid: '',
            name: '',
            aboutme: '',
            lastName: '',
            secondLastName:'',
            email: '',
            gender: '',
            dateOfBirth: maxDate,
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
            maxDate: maxDate,
            minDate: minDate,
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
        if(!this.state.name || !this.state.aboutme){
            showAlert('Warning', 'Please provide the required information.');
        }else{
            if(this.state.name.length >= 2){
                this.setState({
                    loading: true,
                });

                let initials = this.state.name;
                initials = initials.substring(0,2);
    
                const sensate = {
                    uid: this.state.uid,
                    name: this.state.name,
                    initials: initials,
                    aboutme: this.state.aboutme,
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
                        dateTimeOfBirth: this.state.desiredClusters.dateTimeOfBirth,
                        monthAndDay: this.state.desiredClusters.monthAndDay,
                        monthAndYear: this.state.desiredClusters.monthAndYear,
                        month: this.state.desiredClusters.month,
                        skills: this.state.desiredClusters.skills,
                        hobbies: this.state.desiredClusters.hobbies,
                        interests: this.state.desiredClusters.interests,
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
            }else{
                showAlert('Warning', 'Please provide a name of at least 2 characters.');
            }
        }
    }

    render() {
        return (
            <View style={Styles.container}>
                <Image
                    source={require('./../../../assets/img/sensorium.jpeg')}
                    resizeMode={'cover'}
                    style={Styles.logo}
                />
                <View style={Styles.box}>
                    <Text style={Styles.titleText}>
                        Let us know a bit about you.
                    </Text>
                    <Input
                        placeholder='Nickname'
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
                        editable={!this.state.loading}
                        value={this.state.name}
                    />
                    <Input
                        placeholder='About me'
                        leftIcon={
                            <Icon
                                name='edit'
                                size={24}
                                color='purple'
                            />
                        }
                        onChangeText={this.onTextChange('aboutme')}
                        inputContainerStyle={Styles.marginTen}
                        containerStyle={Styles.marginTen}
                        multiline = {true}
                        numberOfLines = {4}
                        editable={!this.state.loading}
                        maxLength={150}
                        value={this.state.aboutme}
                    />
                    <DatePicker
                        style={Styles.marginFive}
                        date={this.state.dateOfBirth}
                        mode="date"
                        placeholder="Select date of birth"
                        format="YYYY-MM-DD"
                        minDate={this.state.minDate}
                        maxDate={this.state.maxDate}
                        confirmBtnText="Select"
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
                        onDateChange={(date) => { this.setState({dateOfBirth: moment(date).toDate()})}}
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
                    type={'outline'}
                    containerStyle={Styles.defaultButton}
                />
            </View>
        );
    }
}

export default RegisterSensie;