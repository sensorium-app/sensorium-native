import React, { Component } from 'react';
import { 
    View, Text, Button as NativeButton, StyleSheet, FlatList,
    SafeAreaView, Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import { mapDispatchToProps } from './../../actions';
import { Icon } from 'react-native-elements';
import Post from './Post';
import Loader from './../loader/Loader';
import Styles from './../Styles';
import firebase from 'react-native-firebase';
import { showMessage, hideMessage } from "react-native-flash-message";

const auth = firebase.auth();
const fcm = firebase.messaging();
const crash = firebase.crashlytics();
const notifications = firebase.notifications();

const { height, width } = Dimensions.get('window');

class Feed extends Component {
    static navigationOptions = {
        title: 'Archipelago',
    };

    constructor(props){
        super(props);

        this.addPost = this.addPost.bind(this);
        //this.renderFooter = this.renderFooter.bind(this);
        //this.renderHeader = this.renderHeader.bind(this);
        //this.retrieveMore = this.retrieveMore.bind(this);
    }

    componentWillMount() {
        this.props.fetchAuthUser();
        //this.props.fetchCluster();
        this.props.fetchClusterPosts();
        this.uid = auth.currentUser.uid;
        this.userDbRef = firebase.firestore().collection('sensies').doc(this.uid);
        this.initNotifications();
    }

    renderPosts(){
        //if(this.props.mainClusterPosts && this.props.mainClusterPosts.posts.length > 0){
            
        //}
    }

    retrieveMore = () => {
        if(this.props.mainClusterPosts.lastPostRef && !this.props.mainClusterPosts.isRefreshing){
            this.props.fetchMoreClusterPosts(this.props.mainClusterPosts.lastPostRef);
        }
    }

    renderHeader = () => {
        try {
          return (
          <Text style={styles.headerText}>Welcome!</Text>
          )
        }
        catch (error) {
          crash.recordError(19,'Feed - ' + JSON.stringify(error));
          return null;
        }
      };

    renderFooter = () => {
        try {
          if (this.props.mainClusterPosts.isRefreshing) {
            return (
              <Loader />
            )
          }
          else {
            return null;
          }
        }
        catch (error) {
          crash.recordError(19,'Feed - ' + JSON.stringify(error));
          return null;
        }
      };

    addPost(){
        this.props.navigation.navigate('AddPost');
    }

    initNotifications(){
        fcm.hasPermission()
        .then(enabled => {
        if (enabled) {
            this.registerFCMToken();
        } else {
            fcm.requestPermission()
            .then(() => {
                this.registerFCMToken(); 
            })
            .catch(error => {
              crash.recordError(19,'Feed - User has rejected FCM permissions');
            });
        } 
        });
      }
    
      registerFCMToken(){
          fcm.getToken()
            .then(fcmToken => {
              if (fcmToken) {
                  this.userDbRef.collection('notifTokens')
                    .where('token','==',fcmToken).get()
                    .then((response)=>{
                        if(response.empty){
                            this.userDbRef.collection('notifTokens').add({
                                token: fcmToken,
                            }).then(()=>{
                                this.listenForNotifications();
                            }).catch((err)=>{
                                crash.recordError(19,'Feed - '+JSON.stringify(err));
                            });
                        }
                    });
              } else {
                crash.recordError(19, 'Feed - '+ 'User ' + this.authUser.uid + ' does not have a device token yet');
              } 
            }).catch((err)=>{
              crash.recordError(19, 'Feed - '+ 'User error: ' + JSON.stringify(err));
            });
      }

      listenForNotifications(){
        this.notificationListener = notifications.onNotification((notification) => {
          this.showAlertMessage(
            notification.title,
            notification.body,
            'success',
            false
          );
        });
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          // Get information about the notification that was opened
          const notification = notificationOpen.notification;
        });
        notifications.getInitialNotification()
          .then((notificationOpen) => {
            if (notificationOpen) {
              // App was opened by a notification
              // Get the action triggered by the notification being opened
              const action = notificationOpen.action;
              // Get information about the notification that was opened
              const notification = notificationOpen.notification;  
            }
        });
      }
    
      showAlertMessage(msg, description, type, autoHide){
        showMessage({
          message: msg,
          description: description,
          type: type,
          autoHide: autoHide,
          onPress: ()=>{
            if(type !== 'warning'){
              this.hideAlertMessage()
            }
          },
          hideOnPress: (type !== 'warning')
        });
      }
    
      hideAlertMessage(){
        hideMessage();
      }

    render() {
        return (
            (this.props.mainClusterPosts && this.props.mainClusterPosts.posts.length > 0) ?
                <SafeAreaView style={styles.container}>
                    <FlatList
                        extraData={this.props.mainClusterPosts.posts}
                        data={this.props.mainClusterPosts.posts}
                        renderItem={({ item }) => (
                            <Post 
                                key={item.idRef}
                                postData={item}
                            />
                        )}
                        keyExtractor={(item, index) => String(index)}
                        ListHeaderComponent={this.renderHeader}
                        ListFooterComponent={this.renderFooter}
                        onEndReached={this.retrieveMore}
                        onEndReachedThreshold={0.1}
                        refreshing={this.props.mainClusterPosts.isRefreshing}
                    />
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
                </SafeAreaView> :
                <View style={Styles.container}>
                    <Loader />
                </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser,
        //mainCluster: state.mainCluster,
        mainClusterPosts: state.mainClusterPosts,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerText: {
        fontFamily: 'System',
        fontSize: 36,
        fontWeight: '600',
        color: '#000',
        marginLeft: 12,
        marginBottom: 12,
    },
    itemContainer: {
        height: 80,
        width: width,
        borderWidth: .2,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontFamily: 'System',
        fontSize: 16,
        fontWeight: '400',
        color: '#000',
    },
    floatingActionButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});