import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import {connect} from 'react-redux';
import {mapDispatchToProps} from '../../actions';
import Post from './Post';

class PostDetail extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
          title: 'Post detail'
        };
    };

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

    render() {
        return (
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