import React, { Component } from 'react';
import { ScrollView } from 'react-native';
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

    render() {
        return (
            <ScrollView>
                {
                    this.props.mainClusterPosts.postDetail &&
                    this.renderPostDetail()
                }
            </ScrollView>
        );
    }
}

const mapStateToProps = state => {
    return {
        mainClusterPosts: state.mainClusterPosts,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostDetail);