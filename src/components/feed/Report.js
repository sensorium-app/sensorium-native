import React, { Component } from 'react';
import { View, Text, Button, Picker, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import {connect} from 'react-redux';
import { mapDispatchToProps } from './../../actions';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';

class Report extends Component {
    static navigationOptions = {
        title: 'Report Post',
    };

    constructor(props) {
        super(props);
        this.state = {
            postId: this.props.navigation.state.params.postIdRef,
            reportType: '',
            description: '',
        }
    }

    onUserSelectChange(value){
        this.setState({
            reportType: value,
        });
    }

    onChangeText(text){
        this.setState({
            description: text,
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Picker
                    selectedValue={this.state.reportType}
                    style={{height: 75, width: 180}}
                    onValueChange={(itemValue) =>
                        this.onUserSelectChange(itemValue)
                    }
                >
                    <Picker.Item key={0} label={'Spam'} value={'spam'} />
                    <Picker.Item key={1} label={'Inappropriate'} value={'inappropriate'} />
                    <Picker.Item key={2} label={'Abuse'} value={'abuse'} />
                    <Picker.Item key={3} label={'Other'} value={'other'} />
                </Picker>
                <Input
                    placeholder='Please indicate a brief description'
                    value={this.state.description}
                    onChangeText={(text)=>this.onChangeText(text)}
                    leftIcon={
                        <Icon
                            name='file-text-o'
                            size={24}
                            color='black'
                        />
                    }
                    multiline={true}
                />
                <Button
                    onPress={() =>{
                        this.props.addReportPost(
                            this.state.postId,
                            this.state.reportType,
                            this.state.description,
                        );
                        alert('Thank you for your report');
                        this.props.navigation.navigate('Archipelago');
                    }}
                    title="Send report"
                />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(Report));

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
});