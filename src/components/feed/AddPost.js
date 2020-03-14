import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Input, Button, Avatar } from 'react-native-elements';
import {connect} from 'react-redux';
import { mapDispatchToProps } from './../../actions';
import ImagePicker from 'react-native-image-crop-picker';
import Styles from './../Styles';
import { showAlert } from './../misc/Alert';

class AddPost extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
          headerRight: 
            <Button
                title="Post"
                type="clear"
                onPress={navigation.getParam('addPost')}
            />
        };
    };

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

    componentDidMount(){
        this.props.navigation.setParams({ 
            addPost: this.addPost,
        });
    }

    onTextChange(e){
        this.setState({
            text: e,
        })
    }
    
    addPost(){
        if(this.state.text != ''){
            let postData = {
                text: this.state.text,
            }
    
            if(this.state.image.path){
                postData['image'] = this.state.image.path;
            }
    
            this.props.addClusterPostAction(postData);
            this.props.navigation.navigate('Archipelago');
        }else{
            showAlert('Information', 'Please add something to share');
        }
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
            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                <View style={{height: 50}}>
                    <View style={{ 
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Avatar
                            rounded
                            source={{
                                uri: '',
                            }}
                            containerStyle={{
                                margin: 5,
                            }}
                        />
                        <Text style={{
                            fontSize: 26,
                        }}>
                            {' name '}
                        </Text>
                    </View>
                </View>
                <View style={{flex:1}}>
                    <Input
                        placeholder='Share something here...'
                        multiline
                        value={this.state.text}
                        onChangeText={this.onTextChange}
                        onSubmitEditing={this.addPost}
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
                </View>
                <View style={{height: 50}}>
                    <Button
                        title="Image"
                        type="outline"
                        onPress={this.openImagePicker}
                        containerStyle={{
                            position: 'absolute',
                            bottom:0,
                            left:0,
                        }}
                    />
                </View>
              </View>
            
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
        width: '100%',
        resizeMode:"cover",
    }
});