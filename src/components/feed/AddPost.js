import React, { Component } from 'react';
import { View, Text, Button as NativeButton, StyleSheet } from 'react-native';
import { Input,Button } from 'react-native-elements';
import {connect} from 'react-redux';
import { mapDispatchToProps } from './../../actions';

class AddPost extends Component {

    constructor(props) {
        super(props);

        this.state = {
            text: '',
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.addPost = this.addPost.bind(this);
    }

    onTextChange(e){
        this.setState({
            text: e,
        })
    }
    
    addPost(){
        this.props.addClusterPostAction({ text: this.state.text })
        this.props.navigation.navigate('Feed');
    }

    render() {
        return (
            <View>
                <Button
                    title="Add"
                    type="outline"
                    onPress={this.addPost}
                    disabled={!this.state.text}
                />
                <Input
                    placeholder='Share something here...'
                    multiline
                    value={this.state.text}
                    onChangeText={this.onTextChange}
                    onSubmitEditing={this.addPost}
                    />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddPost);