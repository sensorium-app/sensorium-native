import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Card, Avatar } from 'react-native-elements';
import {connect} from 'react-redux';
import { mapDispatchToProps } from './../../actions';
import Icon from 'react-native-vector-icons/AntDesign';

class Post extends Component {

    renderCardTitle(image, text, date, postIdRef){
        return (
            <View>
                <View style={{ 
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Avatar
                        rounded
                        source={{
                            uri: image,
                        }}
                    />
                    <Text style={{
                        fontSize: 26,
                    }}>
                        {' ' + text}
                    </Text>
                    <Icon
                        name="downcircleo"
                        size={20}
                        color="orange"
                        style={{
                            marginHorizontal: 10,
                            position: 'absolute',
                            right: 0,
                        }}
                        onPress={()=>{
                            this.props.navigation.navigate('Report', {
                                postIdRef: postIdRef,
                            });
                        }}
                    />
                </View>
                <View
                    style={{ 
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    }}
                >
                    <Text style={{
                        fontSize: 11,
                    }}>
                        {date}
                    </Text>
                </View>
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
                    this.props.fetchPostDetail(postData.idRef);
                    this.props.fetchClusterPostComments(postData.idRef);
                    navigation.navigate('PostDetail');
                }
            }}>
                <View>
                    <Card
                        image={ postData.image ?  { uri: postData.image } : null}
                        imageProps={{
                            resizeMode:"cover",
                        }}
                        imageStyle={{
                            width: '100%',
                        }}
                    >
                        {
                            this.renderCardTitle(postData.user.avatar, postData.user.name, postData.formatedDate, postData.idRef)
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