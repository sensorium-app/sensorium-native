import React, { Component } from 'react';
import { ScrollView, View, StyleSheet, Keyboard } from 'react-native';
import { ListItem, Input, Icon } from 'react-native-elements';
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
                        subtitle={comment.text}
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
            <View style={styles.container}>
                <ScrollView>
                    {
                        this.props.mainClusterPosts.postDetail &&
                        this.renderPostDetail()
                    }
                    {
                        this.props.mainClusterPostComments.comments.length > 0 &&
                        this.renderPostComments()
                    }
                </ScrollView>
                <View style={styles.stickyCommentInput}>
                    <Input
                        placeholder='Comment here...'
                        rightIcon={
                            <Icon
                                type='font-awesome'
                                name='send-o'
                                size={24}
                                color='purple'
                                onPress={this.addComment}
                            />
                        }
                        value={this.state.text}
                        onChangeText={this.onChangeText}
                    />
                </View>
            </View>
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
    container:{
        flex: 1,
    },
    stickyCommentInput: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: 'white',
    },
});