import React, { Component } from 'react';
import { Text, Button as NativeButton } from 'react-native';
import {connect} from 'react-redux';
import { mapDispatchToProps } from './../../actions';
import { ScrollView } from 'react-native-gesture-handler';
import Post from './Post';

class Feed extends Component {
    static navigationOptions = {
        title: 'Archipelago',
    };

    constructor(props){
        super(props);
    }

    componentWillMount() {
        this.props.fetchAuthUser();
        this.props.fetchCluster();
        this.props.fetchClusterPosts();
    }

    renderPosts(){
        if(this.props.mainClusterPosts && this.props.mainClusterPosts.posts.length > 0){
            return this.props.mainClusterPosts.posts
            .map((post, i) => {
                
                return (
                    <Post 
                        key={i}
                        postData={post}
                    />
                );
            });
        }
    }

    render() {
        return (
            <ScrollView>
                <Text>Feed here</Text>
                {
                    this.props.authUser.isFetching &&
                    <Text>Loading...</Text>
                }
                {
                    this.props.authUser.authUser ?
                        <Text>{this.props.authUser.authUser.uid}</Text>
                        : null
                }
                {
                    this.props.mainCluster ?
                    <Text>{JSON.stringify(this.props.mainCluster.mainClusterData.typeData)}</Text>
                    : null
                }
                {
                    this.props.mainClusterPosts.isFetching &&
                    <Text>Loading...</Text>
                }
                {
                    this.props.mainClusterPosts ?
                    this.renderPosts()
                    : null
                }
                <NativeButton
                    onPress={() => this.props.navigation.navigate('FeedDetail')}
                    title="Go to FeedDetail"
                />
                <NativeButton
                    onPress={() => this.props.navigation.navigate('ChatList')}
                    title="Go to ChatList"
                />
                <NativeButton
                    onPress={() => this.props.navigation.navigate('Profile')}
                    title="Go to Profile"
                />
            </ScrollView>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser,
        mainCluster: state.mainCluster,
        mainClusterPosts: state.mainClusterPosts,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);