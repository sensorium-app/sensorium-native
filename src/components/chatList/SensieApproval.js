import React, { Component } from 'react';
import { Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { withNavigation } from 'react-navigation';

class SensieApproval extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sensies: [],
        };
        this.text = 'A new sensie needs approval to join!';
        if(this.props.pendingApprovals.length > 1){
            this.text = 'New sensies need approval to join!';
        }
    }

    render(){
        return(
            <TouchableOpacity style={styles.box} onPress={()=>{
                    this.props.navigation.navigate('SensieApprovalList', {
                        pendingApprovals: this.props.pendingApprovals,
                    })
                }}
            >
                <Text style={styles.text}>{this.text}</Text>
            </TouchableOpacity>
        );
    }
}

export default withNavigation(SensieApproval);

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