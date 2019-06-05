import React, { Component } from 'react';
import { ScrollView, View, Text, Button as NativeButton, StyleSheet, Image } from 'react-native';
import { Input,Button } from 'react-native-elements';
import {connect} from 'react-redux';
import { mapDispatchToProps } from './../../actions';
import ImagePicker from 'react-native-image-crop-picker';

class AddPost extends Component {

    constructor(props) {
        super(props);

        this.state = {
            text: '',
            image: {},
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.addPost = this.addPost.bind(this);
        this.openImagePicker = this.openImagePicker.bind(this);
    }

    onTextChange(e){
        this.setState({
            text: e,
        })
    }
    
    addPost(){
        let postData = {
            text: this.state.text,
        }

        if(this.state.image.path){
            postData['image'] = this.state.image.path;
        }

        this.props.addClusterPostAction(postData);
        this.props.navigation.navigate('Feed');
    }

    openImagePicker(){
        ImagePicker.openPicker({
            cropping: true,
        }).then(image => {
            this.setState({
                image,
            })
        }).catch((err)=>{
            console.log(err);
        });
    }

    render() {
        return (
            <ScrollView>
                <Button
                    title="Add"
                    type="outline"
                    onPress={this.addPost}
                    disabled={!this.state.text}
                />
                <Button
                    title="Image"
                    type="outline"
                    onPress={this.openImagePicker}
                />
                {
                    this.state.image.path ?
                    <View style={styles.previewImageContainer}>
                        <Image
                            source={{ uri: this.state.image.path}}
                            style={styles.previewImage}
                        /> 
                    </View>
                    : null
                }
                <Input
                    placeholder='Share something here...'
                    multiline
                    value={this.state.text}
                    onChangeText={this.onTextChange}
                    onSubmitEditing={this.addPost}
                    />
            </ScrollView>
        );
    }
}

const mapStateToProps = state => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddPost);

const styles = StyleSheet.create({
    previewImageContainer:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center', 
    },
    previewImage: {
        width: 100,
        height: 100,
    }
});