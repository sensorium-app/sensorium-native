import React, { Component } from 'react';
import { View, Text, Button as NativeButton, StyleSheet } from 'react-native';
import {connect} from 'react-redux';
import { mapDispatchToProps } from './../../actions';
import { Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import Post from './Post';

class Feed extends Component {
    static navigationOptions = {
        title: 'Archipelago',
    };

    constructor(props){
        super(props);

        this.addPost = this.addPost.bind(this);
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

    addPost(){
        this.props.navigation.navigate('AddPost');
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    {
                        this.props.authUser.isFetching &&
                        <Text>Loading...</Text>
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
                </ScrollView>
                <View style={styles.floatingActionButton}>
                    <Icon
                        raised
                        reverse
                        name='plus'
                        type='antdesign'
                        color='purple'
                        onPress={this.addPost}
                    />
                </View>
            </View>
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

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    floatingActionButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});