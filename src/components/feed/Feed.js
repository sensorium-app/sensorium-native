import React, { Component } from 'react';
import { View, Text, Button as NativeButton, Image } from 'react-native';
import {connect} from 'react-redux';
import { mapDispatchToProps } from './../../actions';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, ListItem, Button, Icon } from 'react-native-elements'

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
                    <Card
                        title={post.user.name}
                        image={{ uri: post.image }}
                        key={i}>
                        <Text style={{marginBottom: 10}}>
                            {post.text}
                        </Text>
                        <Button
                            icon={<Icon name='code' color='#ffffff' />}
                            backgroundColor='#03A9F4'
                            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                            title='VIEW DETAIL' />
                    </Card>
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