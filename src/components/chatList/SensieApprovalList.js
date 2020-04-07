import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/AntDesign';
import Styles from '../Styles';
import {connect} from 'react-redux';
import { mapDispatchToProps } from './../../actions';
import {
    getSensieData,
} from '../../api/cluster';
import { showAlert } from './../misc/Alert';
import Loader from '../loader/Loader';

class SensieApprovalList extends Component {

    static navigationOptions = {
        title: 'Sensie Approval',
    };

    constructor(props) {
        super(props);
        //console.log(props);
        this.state = {
            sensies: [],
        };
        this.sendNewSensieResponse = this.sendNewSensieResponse.bind(this);
    }

    componentDidMount(){
        this.props.fetchSensieApprovalStatus();
        this.getSensiesData();
    }

    getSensiesData(){
        let sensiesPromise = [];
        this.props.navigation.state.params.pendingApprovals.forEach((sensieId)=>{
            console.log(sensieId);
            sensiesPromise.push(
                getSensieData(sensieId)
            )
        });

        Promise.all(sensiesPromise).then((sensiesList)=>{
            //console.log(sensiesList);
            this.setState({
                sensies: sensiesList
            });
        }).catch((err)=>{
            console.log(err);
        });
    }

    sendNewSensieResponse(uid, status){
        this.props.addSensieApprovalOrDenialAction(uid,status);
        showAlert('Info', 'Information sent');
        this.props.navigation.navigate('Chat');
    }

    renderRightIcon(myStatus,sensie){
        if(myStatus){
            if(myStatus=='approve'){
                return (
                    <Text style={{color:'#5cb85c',fontWeight:'bold'}}>
                        Approved by me
                    </Text>
                );
            }else{
                return (
                    <Text style={{color:'#f0ad4e',fontWeight:'bold'}}>
                        Denied by me
                    </Text>
                );
            }
        }else{
            return (
                <Button
                    icon={
                        <Icon
                        name="checkcircleo"
                        size={15}
                        color="purple"
                        />
                    }
                    type={'clear'}
                    onPress={()=>{
                        this.sendNewSensieResponse(sensie.uid, 'approve');
                    }}
                />
            );
        }
    }
    
    renderSensiesList(){
        return this.state.sensies.map((sensie, i) => {
            //console.log(this.props.sensieApprovalStatus.myStatus);
            return (
                <ListItem
                    key={i}
                    //leftAvatar={{ source: { uri: comment.user.avatar } }}
                    title={sensie.name}
                    subtitle={sensie.aboutme}
                    rightIcon={
                        this.renderRightIcon(this.props.sensieApprovalStatus.myStatus, sensie)
                    }
                    rightElement={
                        (!this.props.sensieApprovalStatus.myStatus) &&
                        <Button
                            icon={
                                <Icon
                                name="closecircleo"
                                size={15}
                                color="red"
                                />
                            }
                            type={'clear'}
                            onPress={()=>{
                                this.sendNewSensieResponse(sensie.uid, 'deny');
                            }}
                        />
                    }
                />
            )
        });
    }

    render(){
        return(
            <View style={Styles.marginTen}>
            {
                (this.props.sensieApprovalStatus) ?
                this.renderSensiesList() :
                <Loader />
            }
            </View>
        );
    }
}

//export default SensieApprovalList;
const mapStateToProps = state => {
    console.log(state.mainClusterPosts);
    return {
        isLoading: state.mainClusterPosts.isFetching,
        sensieApprovalStatus: state.mainClusterPosts.sensieApprovalStatus,
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SensieApprovalList);