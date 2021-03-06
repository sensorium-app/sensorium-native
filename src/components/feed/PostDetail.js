import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Keyboard, Text } from 'react-native';
import { ListItem, Input } from 'react-native-elements';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../../actions';
import Post from './Post';

class PostDetail extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
          title: 'Post detail'
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            text: '',
        }

        this.onChangeText = this.onChangeText.bind(this);
        this.addComment = this.addComment.bind(this);
    }
    

    renderPostDetail(){
        if(this.props.mainClusterPosts.postDetail.user){
            return (
                <Post 
                    postData={this.props.mainClusterPosts.postDetail}
                />
            )
        }
    }

    renderPostComments(){
        if(this.props.mainClusterPostComments && this.props.mainClusterPostComments.comments.length > 0){
            return this.props.mainClusterPostComments.comments
            .map((comment, i) => {
                return (
                    <ListItem
                        key={i}
                        leftAvatar={{ source: { uri: comment.user.avatar } }}
                        title={comment.user.name}
                        subtitle={
                            <View>
                                <View style={{ 
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <Text style={{
                                        fontSize: 8,
                                    }}>
                                        {comment.formatedDate}
                                    </Text>
                                </View>
                                <View
                                    style={{ 
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <Text source={{ source: { uri: comment.user.avatar } }}>
                                        {comment.text}
                                    </Text>
                                </View>
                            </View>
                        }
                    />
                )
            });
        }
    }

    onChangeText(e){
        this.setState({
            text: e,
        })
    }

    addComment(){
        if(!this.state.text){
            alert('Please put a comment in')
        }else{
            this.props.addClusterPostCommentAction(this.props.mainClusterPosts.postDetail.idRef, this.state.text);
            this.setState({
                text: '',
            });
            Keyboard.dismiss();
        }
    }

    render() {
        return (
            <ScrollView contentContainerStyle={styles.scrollMainStyle}
                style={styles.scrollStyle}>
                <View style={styles.scrollMainContent}>
                    {
                        this.props.mainClusterPosts.postDetail &&
                        this.renderPostDetail()
                    }
                    {
                        this.props.mainClusterPostComments.comments.length > 0 &&
                        this.renderPostComments()
                    }
                </View>
                <View style={styles.inputComment}>
                    <Input
                        placeholder='Comment here...'
                        value={this.state.text}
                        onChangeText={this.onChangeText}
                        onSubmitEditing={this.addComment}
                    />
                </View>
            </ScrollView>
        );
    }
}

const mapStateToProps = state => {
    return {
        mainClusterPosts: state.mainClusterPosts,
        mainClusterPostComments: state.mainClusterPostComments,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostDetail);

const styles = StyleSheet.create({
    scrollMainStyle:{
        flexGrow: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    scrollStyle: {
        backgroundColor: 'white',
        paddingBottom: 20,
    },
    scrollMainContent:{
        flex: 1,
        justifyContent: 'flex-start',
    },
    inputComment:{
        flex: 1,
        justifyContent: 'flex-end',
    },
});