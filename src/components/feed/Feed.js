import React, { Component } from 'react';
import { View, Text, Button as NativeButton, Image } from 'react-native';
import firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import {mapDispatchToProps} from './../../actions';
import { ScrollView } from 'react-native-gesture-handler';
import { Card, ListItem, Button, Icon } from 'react-native-elements'

const db = firebase.firestore();

class Feed extends Component {
    static navigationOptions = {
        title: 'Archipelago',
    };

    constructor(props){
        super(props);
    }

    componentWillMount() {
        this.props.fetchAuthUser();
    }

    getPosts(){
        const {authUser} = this.props;
        
        let postsData = [];
        if(authUser.authUser.uid){
            db.collection("clusters").where("sensates."+authUser.authUser.uid, "==", true).get().then((clusters)=>{
                const clusterId = clusters.docs[0].id;

                db.collection("clusters").doc(clusterId).collection('posts')
                .orderBy("date", "desc").limit(25).get().then((posts)=>{
                    posts.docs.forEach((post)=>{
                        postsData.push(post.data())
                    });


                    return postsData
                        .map((post, i) => {
                            console.log(post);
                            
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

                });

            }).catch((err)=>{
                console.log(err);
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
                    this.props.authUser ?
                        this.getPosts()
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
        authUser: state.authUser
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);