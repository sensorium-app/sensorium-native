import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Card, Avatar } from 'react-native-elements';
import {connect} from 'react-redux';
import { mapDispatchToProps } from './../../actions';
import Icon from 'react-native-vector-icons/AntDesign';

class Post extends Component {

    renderCardTitle(image, text){
        return (
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Avatar
                    rounded
                    source={{
                        uri: image,
                    }}
                />
                <Text style={{
                    fontSize: 26,
                }}>{text}</Text>
            </View>
        )
    }

    renderLikeSection(likeCount, postIdRef){
        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
                <Icon
                    name="hearto"
                    size={20}
                    color="red" 
                    onPress={()=>this.props.addLike(postIdRef)}
                    style={{marginHorizontal: 10,}}
                />
                {
                    (likeCount > 0) ?
                    <Text>{likeCount}</Text> :
                    null
                }
            </View>
        )
    }

    renderCommentSection(commentCount){
        return (
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', }}>
                <Icon
                    name="message1"
                    size={20}
                    color="purple"
                    style={{marginHorizontal: 10,}}
                />
                {
                    (commentCount > 0) ?
                    <Text>{commentCount}</Text> :
                    null
                }
            </View>
        )
    }

    render() {
        const { postData, navigation } = this.props;
        return (
            <TouchableWithoutFeedback onPress={() => {
                if(navigation.state.routeName !== 'PostDetail'){
                    navigation.navigate('PostDetail', {
                        postData: postData,
                    })
                }
            }}>
                <View>
                    <Card
                        image={ postData.image ?  { uri: postData.image } : null}
                        imageProps={{
                            resizeMode:"contain",
                        }}>
                        {
                            this.renderCardTitle(postData.user.avatar, postData.user.name)
                        }
                        <Text style={{marginBottom: 20, marginTop: 10,fontSize: 18}}>
                            {postData.text}
                        </Text>
                        <View
                            style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}
                        >
                            {
                                this.renderLikeSection(postData.likeCount, postData.idRef)
                            }
                            {
                                this.renderCommentSection(postData.commentCount)
                            }
                        </View>
                        
                    </Card>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const mapStateToProps = state => {
    return {
    }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(Post));