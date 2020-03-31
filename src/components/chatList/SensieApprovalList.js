import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import Styles from '../Styles';
import {
    getSensieData
} from '../../api/cluster';

class SensieApprovalList extends Component {

    static navigationOptions = {
        title: 'Sensie Approval',
    };

    constructor(props) {
        super(props);
        this.state = {
            sensies: [],
        };
    }

    componentDidMount(){
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
            console.log(sensiesList);
            this.setState({
                sensies: sensiesList
            })
        }).catch((err)=>{
            console.log(err);
        });
    }
    
    renderSensiesList(){
        return this.state.sensies.map((sensie, i) => {
            return (
                <ListItem
                    key={i}
                    //leftAvatar={{ source: { uri: comment.user.avatar } }}
                    title={sensie.name}
                />
            )
        });
    }

    render(){
        return(
            <View style={Styles.marginTen}>
            {this.renderSensiesList()}
            </View>
        );
    }
}

export default SensieApprovalList;

const styles = StyleSheet.create({
    box:{
        backgroundColor:'#ffc107',
        width: '100%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 5,
    },
    text: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#fff",
    }
});