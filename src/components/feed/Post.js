import React, { Component } from 'react';
import { View, Text } from 'react-native';
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
        const { postData } = this.props;
        return (
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
        );
    }
}

const mapStateToProps = state => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Post);